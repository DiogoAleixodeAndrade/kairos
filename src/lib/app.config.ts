export const appConfig = {
  name: "Kairos",
  slogan: "O tempo certo para evoluir.",

  useDemoMode: true,
  useSupabaseSync: false,
  useAIEdgeFunction: process.env.EXPO_PUBLIC_USE_AI_EDGE === "true",

  defaultUser: {
    name: "Diogo",
  },
};