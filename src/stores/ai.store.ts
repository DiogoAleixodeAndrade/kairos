import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildKairosAIContext } from "@/features/ai/kairos-ai.context";
import { generateKairosAIReport } from "@/features/ai/kairos-ai.service";
import type { AIMessage, DailyAIReport } from "@/features/ai/ai.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { askKairosChat } from "@/features/ai/kairos-chat.service";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";

type AIState = {
  reports: DailyAIReport[];
  messages: AIMessage[];
  isGeneratingReport: boolean;
  isSendingMessage: boolean;

  getLatestReport: () => DailyAIReport | null;
  generateReport: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createLocalAIAnswer(content: string) {
  const context = buildKairosAIContext();
  const message = content.toLowerCase();

  if (message.includes("peso")) {
    return `Seu peso atual é ${context.progress.summary.currentWeightKg.toFixed(
      1
    )} kg. Você já eliminou ${context.progress.summary.lostWeightKg.toFixed(
      1
    )} kg desde o início e completou ${
      context.progress.summary.progressPercentage
    }% do caminho até sua meta. O mais importante agora é olhar a tendência semanal, não uma pesagem isolada.`;
  }

  if (message.includes("prote")) {
    const proteinTarget = context.nutrition.targets.proteinG;
    const proteinCurrent = context.nutrition.todaySummary.proteinG;
    const proteinMissing = Math.max(0, proteinTarget - proteinCurrent);

    return `Hoje você registrou aproximadamente ${Math.round(
      proteinCurrent
    )}g de proteína. Ainda faltam cerca de ${Math.round(
      proteinMissing
    )}g para bater sua meta. Uma boa próxima ação seria colocar uma fonte proteica forte na próxima refeição.`;
  }

  if (message.includes("água") || message.includes("agua")) {
    const waterTarget = context.nutrition.targets.waterMl;
    const waterCurrent = context.nutrition.todaySummary.waterMl;
    const waterMissing = Math.max(0, waterTarget - waterCurrent);

    return `Hoje você registrou ${(waterCurrent / 1000).toFixed(
      1
    )}L de água. Ainda faltam aproximadamente ${(waterMissing / 1000).toFixed(
      1
    )}L para sua meta. Divide isso em blocos menores para não precisar compensar tudo de uma vez.`;
  }

  if (message.includes("sono")) {
    return `Seu último resumo de sono mostra ${context.sleep.summary.durationText} com qualidade ${context.sleep.summary.qualityScore}/10. Se a recuperação cair, tente ajustar primeiro horário de dormir, luz antes de deitar e consistência da rotina noturna.`;
  }

  return "Analisando seus dados atuais, o melhor ajuste é focar no básico que mais sustenta resultado: bater proteína, beber água, registrar alimentação, manter treino e cuidar do sono. Esses pontos constroem consistência real.";
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      reports: [],
      messages: [
        {
          id: "welcome-ai-message",
          role: "assistant",
          content:
            "Eu sou a Kairos AI. Posso analisar sua alimentação, treino, sono, água e progresso para te mostrar o próximo ajuste certo.",
          createdAt: new Date().toISOString(),
        },
      ],
      isGeneratingReport: false,
      isSendingMessage: false,

      getLatestReport: () => {
        return get().reports[0] ?? null;
      },

      generateReport: async () => {
        set({ isGeneratingReport: true });

        try {
          const report = await generateKairosAIReport();

          set((state) => ({
            reports: [report, ...state.reports],
          }));
        } finally {
          set({ isGeneratingReport: false });
        }
      },

      sendMessage: async (content: string) => {
        const trimmedContent = content.trim();

        if (!trimmedContent) return;

        const userMessage: AIMessage = {
          id: createId(),
          role: "user",
          content: trimmedContent,
          createdAt: new Date().toISOString(),
        };

        const historyBeforeQuestion = get().messages;

        set((state) => ({
          messages: [...state.messages, userMessage],
          isSendingMessage: true,
        }));

        try {
          let answer: string;

          try {
            answer = await askKairosChat(trimmedContent, historyBeforeQuestion);
          } catch (error) {
            console.warn("Erro no chat com Gemini, usando resposta local:", error);
            answer = createLocalAIAnswer(trimmedContent);
          }

          const assistantMessage: AIMessage = {
            id: createId(),
            role: "assistant",
            content: answer,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
          }));

          scheduleSafeAutoSync();
        } finally {
          set({ isSendingMessage: false });
        }
      },

      clearMessages: () =>
        set({
          messages: [
            {
              id: "welcome-ai-message",
              role: "assistant",
              content:
                "Conversa reiniciada. Me pergunte sobre alimentação, treino, sono, peso ou progresso.",
              createdAt: new Date().toISOString(),
            },
          ],
        }),
    }),
    {
      name: "kairos-ai-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
