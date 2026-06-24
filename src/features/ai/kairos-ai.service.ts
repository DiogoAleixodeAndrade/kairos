import type { DailyAIContext, DailyAIReport } from "@/features/ai/ai.types";
import { createChatPrompt, createDailyReportPrompt } from "@/features/ai/kairos-ai.prompt";
import { supabase } from "@/lib/supabase";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function calculateLocalScore(context: DailyAIContext) {
  let score = 0;

  const caloriesRatio =
    context.nutrition.caloriesTargetKcal > 0
      ? context.nutrition.caloriesKcal / context.nutrition.caloriesTargetKcal
      : 0;

  const proteinRatio =
    context.nutrition.proteinTargetG > 0
      ? context.nutrition.proteinG / context.nutrition.proteinTargetG
      : 0;

  const waterRatio =
    context.nutrition.waterTargetMl > 0
      ? context.nutrition.waterMl / context.nutrition.waterTargetMl
      : 0;

  const sleepRatio = context.sleep.durationMinutes / 450;

  score += Math.min(25, caloriesRatio * 25);
  score += Math.min(25, proteinRatio * 25);
  score += Math.min(20, waterRatio * 20);
  score += Math.min(20, sleepRatio * 20);
  score += context.training.workoutCompleted ? 10 : 0;

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function generateLocalDailyReport(context: DailyAIContext): DailyAIReport {
  const score = calculateLocalScore(context);

  const positives: string[] = [];
  const attentionPoints: string[] = [];

  if (context.progress.lostWeightKg > 0) {
    positives.push(`Você já eliminou ${context.progress.lostWeightKg.toFixed(1)} kg desde o início da jornada.`);
  }

  if (context.training.workoutCompleted) {
    positives.push("Você concluiu o treino planejado para hoje.");
  }

  if (context.nutrition.waterMl >= context.nutrition.waterTargetMl * 0.7) {
    positives.push("Sua hidratação está caminhando bem hoje.");
  }

  if (context.nutrition.proteinG < context.nutrition.proteinTargetG * 0.8) {
    attentionPoints.push("Sua proteína ficou abaixo do ideal para o objetivo.");
  }

  if (context.sleep.durationMinutes < 420) {
    attentionPoints.push("Seu sono ficou abaixo de 7 horas, o que pode afetar fome, recuperação e performance.");
  }

  if (context.nutrition.waterMl < context.nutrition.waterTargetMl * 0.7) {
    attentionPoints.push("Sua ingestão de água ainda está baixa para a meta do dia.");
  }

  if (positives.length === 0) {
    positives.push("Você registrou dados suficientes para a Kairos AI analisar seu dia.");
  }

  if (attentionPoints.length === 0) {
    attentionPoints.push("Nenhum ponto crítico apareceu hoje. O foco é manter a consistência.");
  }

  let recommendation = "Amanhã, mantenha o foco em proteína, água e sono consistente.";

  if (context.nutrition.proteinG < context.nutrition.proteinTargetG * 0.8) {
    recommendation = "Amanhã, adicione uma fonte forte de proteína logo no café da manhã.";
  } else if (context.sleep.durationMinutes < 420) {
    recommendation = "Amanhã, antecipe sua rotina noturna para tentar dormir pelo menos 30 minutos mais cedo.";
  } else if (context.nutrition.waterMl < context.nutrition.waterTargetMl * 0.7) {
    recommendation = "Amanhã, distribua sua água em blocos de 500 ml ao longo do dia.";
  }

  return {
    id: createId(),
    reportDate: new Date().toISOString(),
    title: "Relatório Kairos — Hoje",
    summary:
      "Seu dia mostra uma base clara de evolução. O próximo passo é ajustar os pontos que mais influenciam consistência: proteína, água, treino e sono.",
    positives: positives.slice(0, 3),
    attentionPoints: attentionPoints.slice(0, 3),
    recommendation,
    consistencyScore: score,
    createdAt: new Date().toISOString(),
  };
}

export async function generateDailyReport(context: DailyAIContext): Promise<DailyAIReport> {
  const useEdgeFunction = process.env.EXPO_PUBLIC_USE_AI_EDGE === "true";

  if (!useEdgeFunction) {
    return generateLocalDailyReport(context);
  }

  const { data, error } = await supabase.functions.invoke("kairos-ai", {
    body: {
      type: "daily_report",
      context,
      prompt: createDailyReportPrompt(context),
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.report) {
    throw new Error("A função de IA não retornou um relatório válido.");
  }

  return {
    id: createId(),
    reportDate: new Date().toISOString(),
    title: data.report.title,
    summary: data.report.summary,
    positives: data.report.positives,
    attentionPoints: data.report.attentionPoints,
    recommendation: data.report.recommendation,
    consistencyScore: data.report.consistencyScore,
    createdAt: new Date().toISOString(),
  };
}

export async function askKairosAI(context: DailyAIContext, message: string): Promise<string> {
  const useEdgeFunction = process.env.EXPO_PUBLIC_USE_AI_EDGE === "true";

  if (!useEdgeFunction) {
    const proteinMissing = Math.max(0, context.nutrition.proteinTargetG - context.nutrition.proteinG);
    const waterMissing = Math.max(0, context.nutrition.waterTargetMl - context.nutrition.waterMl);

    if (message.toLowerCase().includes("peso")) {
      return `Seu peso atual é ${context.progress.currentWeightKg.toFixed(1)} kg. Você já eliminou ${context.progress.lostWeightKg.toFixed(1)} kg desde o início e completou ${context.progress.progressPercentage}% do caminho até sua meta. O ponto mais importante agora é manter a consistência semanal, não reagir a uma única pesagem.`;
    }

    if (message.toLowerCase().includes("prote")) {
      return `Hoje ainda faltam aproximadamente ${Math.round(proteinMissing)}g de proteína para bater sua meta. A melhor estratégia é inserir uma fonte proteica simples na próxima refeição, como ovos, frango, iogurte proteico, whey ou carne magra.`;
    }

    if (message.toLowerCase().includes("água") || message.toLowerCase().includes("agua")) {
      return `Hoje ainda faltam aproximadamente ${Math.round(waterMissing / 1000 * 10) / 10}L de água para sua meta. Divida isso em blocos menores para não precisar compensar tudo de uma vez.`;
    }

    return "Analisando seus dados de hoje, o melhor ajuste é focar no básico que mais gera resultado: proteína suficiente, água consistente, treino concluído e sono acima de 7 horas. Esses quatro pontos sustentam sua evolução.";
  }

  const { data, error } = await supabase.functions.invoke("kairos-ai", {
    body: {
      type: "chat",
      context,
      message,
      prompt: createChatPrompt(context, message),
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.message) {
    throw new Error("A função de IA não retornou uma resposta válida.");
  }

  return data.message;
}