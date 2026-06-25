export type DailyAIContext = {
  date: string;

  user: {
    name: string;
  };

  nutrition: {
    caloriesKcal: number;
    caloriesTargetKcal: number;
    proteinG: number;
    proteinTargetG: number;
    carbsG: number;
    carbsTargetG: number;
    fatG: number;
    fatTargetG: number;
    waterMl: number;
    waterTargetMl: number;
  };

  training: {
    workoutTitle: string | null;
    workoutCompleted: boolean;
    durationMinutes: number;
    estimatedCalories: number;
    completedThisWeek: number;
  };

  sleep: {
    durationMinutes: number;
    durationText: string;
    qualityScore: number;
    energyScore: number;
    interruptions: number;
  };

  progress: {
    startWeightKg: number;
    currentWeightKg: number;
    targetWeightKg: number;
    lostWeightKg: number;
    remainingWeightKg: number;
    progressPercentage: number;
  };
};

export type DailyAIReport = {
  id: string;
  createdAt: string;
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

export type AIMessageRole = "user" | "assistant";

export type AIMessage = {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
};
