type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type KairosChatRequest = {
  context: unknown;
  question: string;
  history?: ChatMessage[];
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

function sanitizeHistory(history: ChatMessage[] | undefined) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-12);
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

    const body = (await request.json()) as KairosChatRequest;

    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question) {
      return createJsonResponse(
        {
          error: "Pergunta não enviada.",
        },
        400
      );
    }

    if (!body.context) {
      return createJsonResponse(
        {
          error: "Contexto do usuário não enviado.",
        },
        400
      );
    }

    const history = sanitizeHistory(body.history);

    const systemInstruction = `
Você é a Kairos AI, coach premium de evolução pessoal: alimentação, treino, sono, hidratação e progresso físico.

Dados atuais do usuário:
${JSON.stringify(body.context, null, 2)}

Regras:
- Responda sempre em português do Brasil.
- Seja direto, humano, motivador e premium.
- Use os dados reais do contexto sempre que fizer sentido (números de calorias, proteína, água, peso, sono, treino).
- Não invente dados que não estejam no contexto. Se faltar registro, oriente o usuário a registrar.
- Responda em texto corrido curto, no máximo 2 parágrafos, sem markdown, sem listas, sem títulos.
- Termine com uma próxima ação prática quando fizer sentido.
`;

    const contents = [
      ...history.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: message.content,
          },
        ],
      })),
      {
        role: "user",
        parts: [
          {
            text: question,
          },
        ],
      },
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: systemInstruction,
            },
          ],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 512,
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

    const answer = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

    if (!answer) {
      return createJsonResponse(
        {
          error: "A Gemini API não retornou resposta válida.",
        },
        500
      );
    }

    return createJsonResponse({
      answer,
    });
  } catch (error) {
    return createJsonResponse(
      {
        error: error instanceof Error ? error.message : "Erro inesperado no chat da Kairos AI.",
      },
      500
    );
  }
});
