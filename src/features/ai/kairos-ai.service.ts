import { buildKairosAIContext } from "@/features/ai/kairos-ai.context";
import type { DailyAIReport } from "@/features/ai/ai.types";
import { supabase } from "@/lib/supabase";

type KairosAIResponse = {
  report?: {
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
  error?: string;
};

function createFallbackReport(): DailyAIReport {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    title: "Relatório Kairos",
    summary:
      "A Kairos não conseguiu acessar a IA real agora, mas seus dados locais continuam salvos.",
    recommendation:
      "Continue registrando alimentação, água, treino, sono e peso. A consistência é mais importante que um dia perfeito.",
    nutritionFeedback:
      "Registre suas refeições e acompanhe calorias, proteína, carboidratos, gorduras e água.",
    trainingFeedback:
      "Mantenha seus treinos alinhados ao objetivo e registre as sessões concluídas.",
    sleepFeedback:
      "Priorize uma rotina de sono consistente para melhorar recuperação e desempenho.",
    progressFeedback:
      "Atualize peso, medidas e fotos para acompanhar sua evolução com mais clareza.",
    nextAction: "Registre sua próxima refeição ou atualize sua água de hoje.",
    consistencyScore: 65,
  };
}

export async function generateKairosAIReport(): Promise<DailyAIReport> {
  try {
    const context = buildKairosAIContext();

    const { data, error } = await supabase.functions.invoke<KairosAIResponse>("kairos-ai", {
      body: {
        context,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.report) {
      throw new Error(data?.error || "A Kairos AI não retornou relatório.");
    }

    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      title: data.report.title,
      summary: data.report.summary,
      recommendation: data.report.recommendation,
      nutritionFeedback: data.report.nutritionFeedback,
      trainingFeedback: data.report.trainingFeedback,
      sleepFeedback: data.report.sleepFeedback,
      progressFeedback: data.report.progressFeedback,
      nextAction: data.report.nextAction,
      consistencyScore: data.report.consistencyScore,
    };
  } catch (error) {
    console.warn("Erro ao gerar relatório com Gemini:", error);

    return createFallbackReport();
  }
}