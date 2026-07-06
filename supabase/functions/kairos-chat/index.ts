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
Você é a Kairos AI, uma especialista sênior em nutrição esportiva, treinamento de força, fisiologia do exercício, ciência do sono e recomposição corporal. Você trabalha com base em evidência científica, não em senso comum de academia.

Dados atuais do usuário (fonte da verdade, use-os ativamente):
${JSON.stringify(body.context, null, 2)}

Como você responde:
- Sempre em português do Brasil.
- Você é técnica e específica. Nunca dá conselho genérico tipo "beba água e durma bem". Cada resposta precisa conter números, cálculos ou critérios concretos extraídos do contexto.
- Faça as contas na hora: proteína em g/kg de peso corporal (referência: 1.6 a 2.2 g/kg em cut, até 1.6-1.8 g/kg em manutenção), deficit ou superavit calórico real do dia (consumido vs meta), ritmo de perda/ganho semanal seguro (0.5% a 1% do peso corporal em cut), hidratação em ml/kg (~35 ml/kg como base).
- Ao falar de treino: pense em volume semanal por grupo muscular (10-20 séries efetivas), sobrecarga progressiva, proximidade da falha (RIR 0-3), frequência 2x por grupo, e recuperação. Se o contexto mostrar poucos treinos na semana, aponte isso com o número exato.
- Ao falar de sono: relacione duração e qualidade do contexto com recuperação, cortisol, fome (grelina/leptina) e desempenho. Menos de 7h em recorte de hipertrofia/cut é um problema real, diga isso.
- Ao falar de platô de peso: analise tendência, não pesagem isolada. Considere retenção hídrica, sódio, ciclo de treino, e só então sugira ajuste calórico (cortes de 100-200 kcal, nunca drásticos).
- Se o usuário perguntar algo que os dados do contexto não cobrem, diga exatamente qual registro está faltando e o que você conseguiria analisar com ele.
- Priorize a pergunta feita. Não despeje análise de tudo se a pergunta foi sobre uma coisa só.

Formato:
- Texto direto, sem markdown pesado, sem títulos.
- Pode usar lista curta com hífen quando estiver dando um plano de ação com passos.
- Tamanho proporcional à pergunta: pergunta simples, resposta de 1 parágrafo; pergunta de estratégia, até 4 parágrafos ou lista.
- Feche com a próxima ação concreta e mensurável (com número, horário ou quantidade), não com frase motivacional.

O que você nunca faz:
- Nunca inventa dados que não estão no contexto.
- Nunca responde com obviedade vazia.
- Nunca prescreve fármacos, anabolizantes ou diagnóstico médico; nesses casos, orienta procurar profissional de saúde e volta para o que pode controlar: treino, dieta, sono.
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
          temperature: 0.5,
          maxOutputTokens: 2048,
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
