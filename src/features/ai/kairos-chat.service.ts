import type { AIMessage } from "@/features/ai/ai.types";
import { buildKairosAIContext } from "@/features/ai/kairos-ai.context";
import { supabase } from "@/lib/supabase";

type KairosChatResponse = {
  answer?: string;
  error?: string;
};

export async function askKairosChat(question: string, history: AIMessage[]): Promise<string> {
  const context = buildKairosAIContext();

  const recentHistory = history.slice(-12).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const { data, error } = await supabase.functions.invoke<KairosChatResponse>("kairos-chat", {
    body: {
      context,
      question,
      history: recentHistory,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.answer) {
    throw new Error(data?.error || "A Kairos AI não retornou resposta.");
  }

  return data.answer;
}
