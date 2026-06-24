import type { AIMessage, DailyAIReport } from "@/features/ai/ai.types";
import type { UserAchievement, XPLog } from "@/features/gamification/gamification.types";
import type { NutritionTargets, Meal, WaterLog } from "@/features/nutrition/nutrition.types";
import type {
  BodyMeasurement,
  ProgressPhoto,
  WeightLog,
} from "@/features/progress/progress.types";
import type { SleepLog } from "@/features/sleep/sleep.types";
import type { Workout, WorkoutSession } from "@/features/training/training.types";

export type KairosSyncPayload = {
  version: 1;
  syncedAt: string;

  nutrition: {
    targets: NutritionTargets;
    meals: Meal[];
    waterLogs: WaterLog[];
  };

  training: {
    workouts: Workout[];
    sessions: WorkoutSession[];
  };

  sleep: {
    sleepLogs: SleepLog[];
  };

  progress: {
    startWeightKg: number;
    targetWeightKg: number;
    weightLogs: WeightLog[];
    measurements: BodyMeasurement[];
    photos: ProgressPhoto[];
  };

  ai: {
    reports: DailyAIReport[];
    messages: AIMessage[];
  };

  gamification: {
    totalXp: number;
    xpLogs: XPLog[];
    unlockedAchievements: UserAchievement[];
  };
};

export type AppSyncSnapshotRow = {
  user_id: string;
  payload: KairosSyncPayload;
  synced_at: string;
  created_at: string;
  updated_at: string;
};