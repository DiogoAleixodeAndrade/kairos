import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildDailyAIContext } from "@/features/ai/kairos-ai.context";
import { askKairosAI, generateDailyReport } from "@/features/ai/kairos-ai.service";
import type { AIMessage, DailyAIReport } from "@/features/ai/ai.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
          const context = buildDailyAIContext();
          const report = await generateDailyReport(context);

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

        set((state) => ({
          messages: [...state.messages, userMessage],
          isSendingMessage: true,
        }));

        try {
          const context = buildDailyAIContext();
          const answer = await askKairosAI(context, trimmedContent);

          const assistantMessage: AIMessage = {
            id: createId(),
            role: "assistant",
            content: answer,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
          }));
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