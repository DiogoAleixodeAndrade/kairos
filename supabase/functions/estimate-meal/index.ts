type EstimateMealRequest = {
  description: string;
};

type EstimatedMealResponse = {
  foodName: string;
  quantityG: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

function sanitizeEstimate(
  value: Partial<EstimatedMealResponse>,
): EstimatedMealResponse {
  return {
    foodName: String(value.foodName || "Refeição estimada"),
    quantityG: Math.max(0, Math.round(Number(value.quantityG || 0))),
    caloriesKcal: Math.max(0, Math.round(Number(value.caloriesKcal || 0))),
    proteinG: Math.max(0, Math.round(Number(value.proteinG || 0))),
    carbsG: Math.max(0, Math.round(Number(value.carbsG || 0))),
    fatG: Math.max(0, Math.round(Number(value.fatG || 0))),
  };
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
      405,
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
        500,
      );
    }

    const body = (await request.json()) as EstimateMealRequest;
    const description = body.description?.trim();

    if (!description || description.length < 3) {
      return createJsonResponse(
        {
          error: "Descreva a refeição com mais detalhes.",
        },
        400,
      );
    }

    const prompt = `
Você é uma nutricionista especialista em estimar calorias e macronutrientes.

Estime a refeição abaixo em português do Brasil.

Refeição descrita:
${description}

Retorne somente JSON válido neste formato exato:
{
  "foodName": "nome resumido dos alimentos",
  "quantityG": 0,
  "caloriesKcal": 0,
  "proteinG": 0,
  "carbsG": 0,
  "fatG": 0
}

Regras:
- Some todos os alimentos em um único total.
- Use valores realistas para comida brasileira.
- Se a quantidade não for clara, estime uma porção comum.
- Não coloque unidade nos valores numéricos.
- Não responda com markdown.
- Não responda com texto fora do JSON.
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
          temperature: 0.2,
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
        500,
      );
    }

    const data = await response.json();

    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!outputText) {
      return createJsonResponse(
        {
          error: "A Gemini API não retornou uma estimativa válida.",
        },
        500,
      );
    }

    const jsonText = extractJsonFromText(outputText);
    const parsed = JSON.parse(jsonText) as Partial<EstimatedMealResponse>;
    const estimate = sanitizeEstimate(parsed);

    return createJsonResponse({
      estimate,
    });
  } catch (error) {
    return createJsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao estimar refeição.",
      },
      500,
    );
  }
});
