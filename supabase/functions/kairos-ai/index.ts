import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function extractOutputText(payload: any) {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  const output = payload.output;

  if (!Array.isArray(output)) {
    return "";
  }

  return output
    .flatMap((item) => item.content ?? [])
    .map((contentItem) => contentItem.text ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY não configurada.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const { type, prompt } = body;

    if (!type || !prompt) {
      return new Response(
        JSON.stringify({
          error: "Payload inválido.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "Você é a Kairos AI, uma IA premium de evolução humana. Responda em português do Brasil, com tom direto, elegante e profissional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: result.error?.message ?? "Erro ao chamar OpenAI.",
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const outputText = extractOutputText(result);

    if (type === "daily_report") {
      let report;

      try {
        report = JSON.parse(outputText);
      } catch {
        report = {
          title: "Relatório Kairos — Hoje",
          summary: outputText,
          positives: ["A Kairos AI gerou uma análise inicial."],
          attentionPoints: ["Não foi possível estruturar todos os pontos automaticamente."],
          recommendation: "Revise os dados do dia e tente gerar o relatório novamente.",
          consistencyScore: 70,
        };
      }

      return new Response(
        JSON.stringify({
          report,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: outputText,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro inesperado.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});