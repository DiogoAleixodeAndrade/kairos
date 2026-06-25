type KairosAIRequest = {
  context: unknown;
};

type KairosAIReport = {
  title: string;
  summary: string;
  recommendation: string;
  nutritionFeedback: string;
  trainingFeedback: string;
  sleepFeedback: string;
  progressFeedback: string;
  nextAction: string;
  consistencyScore: number;
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

function sanitizeReport(value: Partial<KairosAIReport>): KairosAIReport {
  const score = Number(value.consistencyScore || 0);

  return {
    title: String(value.title || "Relatório Kairos"),
    summary: String(value.summary || "A Kairos analisou seus dados do dia."),
    recommendation: String(value.recommendation || "Mantenha constância e registre seus dados hoje."),
    nutritionFeedback: String(value.nutritionFeedback || "Continue registrando suas refeições."),
    trainingFeedback: String(value.trainingFeedback || "Mantenha sua rotina de treino alinhada ao objetivo."),
    sleepFeedback: String(value.sleepFeedback || "Priorize recuperação e qualidade do sono."),
    progressFeedback: String(value.progressFeedback || "Acompanhe seu peso e medidas com consistência."),
    nextAction: String(value.nextAction || "Registre sua próxima refeição ou treino."),
    consistencyScore: Math.max(0, Math.min(100, Math.round(score))),
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return createJsonResponse(
      {
        error: "Método não permitido.",
      },
      405
    );
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    if (!geminiApiKey) {
      return createJsonResponse(
        {
          error: "GEMINI_API_KEY não configurada no Supabase.",
        },
        500
      );
    }

    const body = (await request.json()) as KairosAIRequest;

    if (!body.context) {
      return createJsonResponse(
        {
          error: "Contexto do usuário não enviado.",
        },
        400
      );
    }

    const prompt = `
Você é a Kairos AI, uma inteligência de evolução pessoal, alimentação, treino, sono e progresso físico.

Analise os dados do usuário abaixo e gere um relatório diário em português do Brasil.

Contexto do usuário:
${JSON.stringify(body.context, null, 2)}

Retorne somente JSON válido neste formato exato:

{
  "title": "título curto do relatório",
  "summary": "resumo geral do dia",
  "recommendation": "recomendação principal",
  "nutritionFeedback": "feedback sobre alimentação, calorias, macros e água",
  "trainingFeedback": "feedback sobre treino e atividade física",
  "sleepFeedback": "feedback sobre sono e recuperação",
  "progressFeedback": "feedback sobre peso, medidas, evolução e consistência",
  "nextAction": "uma ação prática para o usuário fazer agora",
  "consistencyScore": 0
}

Regras:
- O consistencyScore deve ir de 0 a 100.
- Seja direto, motivador e premium.
- Não invente dados que não estejam no contexto.
- Se algum dado estiver vazio, diga que precisa ser registrado.
- Não responda com markdown.
- Não responda com texto fora do JSON.
- Use tom profissional, humano e encorajador.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return createJsonResponse(
        {
          error: "Erro ao chamar a Gemini API.",
          details: errorText,
        },
        500
      );
    }

    const data = await response.json();

    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!outputText) {
      return createJsonResponse(
        {
          error: "A Gemini API não retornou relatório válido.",
        },
        500
      );
    }

    const jsonText = extractJsonFromText(outputText);
    const parsed = JSON.parse(jsonText) as Partial<KairosAIReport>;
    const report = sanitizeReport(parsed);

    return createJsonResponse({
      report,
    });
  } catch (error) {
    return createJsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao gerar relatório Kairos.",
      },
      500
    );
  }
});