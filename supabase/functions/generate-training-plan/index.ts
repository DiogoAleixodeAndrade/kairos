type GenerateTrainingPlanInput = {
  displayName?: string;
  objective?: string;
  level?: string;
  weightKg?: number;
  daysPerWeek?: number;
  sessionMinutes?: number;
  restrictions?: string;
};

type GenerateTrainingPlanRequest = {
  input: GenerateTrainingPlanInput;
};

type GeneratedExercise = {
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
};

type GeneratedWorkout = {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  estimatedCalories: number;
  exercises: GeneratedExercise[];
};

type GeneratedTrainingPlan = {
  workouts: GeneratedWorkout[];
  weeklyPlan: (string | null)[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function createJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function extractJsonFromText(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Resposta sem JSON válido.");
  }

  return cleaned.slice(start, end + 1);
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function sanitizeExercise(value: any): GeneratedExercise {
  return {
    name: String(value?.name || "Exercício"),
    muscleGroup: String(value?.muscleGroup || "Geral"),
    targetSets: clampInt(value?.targetSets, 1, 8, 3),
    targetReps: String(value?.targetReps || "8–12"),
    restSeconds: clampInt(value?.restSeconds, 20, 240, 60),
  };
}

function sanitizePlan(value: any, daysPerWeek: number): GeneratedTrainingPlan {
  const rawWorkouts = Array.isArray(value?.workouts) ? value.workouts : [];

  const workouts: GeneratedWorkout[] = rawWorkouts
    .slice(0, 7)
    .map((workout: any, index: number) => {
      const id = String(workout?.id || `ai-w${index + 1}`);
      const exercises = Array.isArray(workout?.exercises)
        ? workout.exercises.slice(0, 12).map(sanitizeExercise)
        : [];

      return {
        id,
        title: String(workout?.title || `Treino ${index + 1}`),
        subtitle: String(workout?.subtitle || ""),
        durationMinutes: clampInt(workout?.durationMinutes, 20, 150, 60),
        estimatedCalories: clampInt(workout?.estimatedCalories, 100, 1500, 400),
        exercises,
      };
    })
    .filter((workout: GeneratedWorkout) => workout.exercises.length > 0);

  const validIds = new Set(workouts.map((workout) => workout.id));
  const rawPlan = Array.isArray(value?.weeklyPlan) ? value.weeklyPlan : [];

  let trainingDays = 0;
  const weeklyPlan: (string | null)[] = Array.from({ length: 7 }).map((_, index) => {
    const id = rawPlan[index];
    if (typeof id === "string" && validIds.has(id) && trainingDays < daysPerWeek) {
      trainingDays += 1;
      return id;
    }
    return null;
  });

  return { workouts, weeklyPlan };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return createJsonResponse({ error: "Método não permitido." }, 405);
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    if (!geminiApiKey) {
      return createJsonResponse({ error: "GEMINI_API_KEY não configurada no Supabase." }, 500);
    }

    const body = (await request.json()) as GenerateTrainingPlanRequest;
    const input = body.input || {};

    const daysPerWeek = clampInt(input.daysPerWeek, 1, 7, 5);
    const sessionMinutes = clampInt(input.sessionMinutes, 20, 150, 60);
    const weightKg = Number(input.weightKg) || 75;

    const prompt = `
Você é a Kairos AI, especialista sênior em treinamento de força e periodização.

Monte uma divisão de treino semanal personalizada com base em ciência (volume 10-20 séries semanais por grupo, frequência 2x, sobrecarga progressiva, seleção de exercícios coerente com o objetivo).

Perfil:
- Nome: ${input.displayName || "usuário"}
- Objetivo: ${input.objective || "condicionamento"}
- Nível: ${input.level || "intermediário"}
- Peso: ${weightKg} kg
- Dias de treino por semana: ${daysPerWeek}
- Duração por sessão: ${sessionMinutes} minutos
- Restrições/limitações: ${input.restrictions || "nenhuma"}

Retorne SOMENTE JSON válido neste formato exato:

{
  "workouts": [
    {
      "id": "ai-w1",
      "title": "Push A",
      "subtitle": "Peito • Ombros • Tríceps",
      "durationMinutes": 60,
      "estimatedCalories": 450,
      "exercises": [
        {
          "name": "Supino reto",
          "muscleGroup": "Peito",
          "targetSets": 4,
          "targetReps": "6–8",
          "restSeconds": 90
        }
      ]
    }
  ],
  "weeklyPlan": ["ai-w1", "ai-w2", "ai-w3", null, "ai-w1", "ai-w2", null]
}

Regras rígidas:
- weeklyPlan SEMPRE tem exatamente 7 posições. Índice 0 = domingo ... 6 = sábado.
- Exatamente ${daysPerWeek} posições devem conter um id de treino; as demais devem ser null (descanso).
- Todo id usado em weeklyPlan deve existir em workouts.
- Crie de 3 a 6 treinos distintos e reutilize-os na semana quando fizer sentido.
- Cada treino deve caber em ${sessionMinutes} minutos (ajuste número de exercícios/séries).
- targetReps em formato de faixa, ex "8–12".
- Textos em português do Brasil.
- Não escreva nada fora do JSON.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return createJsonResponse({ error: "Erro ao chamar a Gemini API.", details: errorText }, 500);
    }

    const data = await response.json();
    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!outputText) {
      return createJsonResponse({ error: "A Gemini API não retornou um plano válido." }, 500);
    }

    const jsonText = extractJsonFromText(outputText);
    const parsed = JSON.parse(jsonText);
    const plan = sanitizePlan(parsed, daysPerWeek);

    if (plan.workouts.length === 0) {
      return createJsonResponse({ error: "O plano gerado não continha treinos válidos." }, 500);
    }

    return createJsonResponse({ plan });
  } catch (error) {
    return createJsonResponse(
      {
        error:
          error instanceof Error ? error.message : "Erro inesperado ao gerar o plano de treino.",
      },
      500
    );
  }
});
