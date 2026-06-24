import type { DailyAIContext } from "@/features/ai/ai.types";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";
import { useTrainingStore } from "@/stores/training.store";

export function buildDailyAIContext(): DailyAIContext {
  const nutritionStore = useNutritionStore.getState();
  const trainingStore = useTrainingStore.getState();
  const sleepStore = useSleepStore.getState();
  const progressStore = useProgressStore.getState();

  const nutritionSummary = nutritionStore.getTodaySummary();
  const nutritionTargets = nutritionStore.targets;

  const todayWorkout = trainingStore.getTodayWorkout();
  const completedThisWeek = trainingStore.getCompletedWorkoutsThisWeek();

  const sleepSummary = sleepStore.getSleepSummary();
  const progressSummary = progressStore.getSummary();

  return {
    date: new Date().toISOString(),

    user: {
      name: "Diogo",
    },

    nutrition: {
      caloriesKcal: Math.round(nutritionSummary.caloriesKcal),
      caloriesTargetKcal: nutritionTargets.caloriesKcal,

      proteinG: Math.round(nutritionSummary.proteinG),
      proteinTargetG: nutritionTargets.proteinG,

      carbsG: Math.round(nutritionSummary.carbsG),
      carbsTargetG: nutritionTargets.carbsG,

      fatG: Math.round(nutritionSummary.fatG),
      fatTargetG: nutritionTargets.fatG,

      waterMl: nutritionSummary.waterMl,
      waterTargetMl: nutritionTargets.waterMl,
    },

    training: {
      workoutTitle: todayWorkout?.title ?? null,
      workoutCompleted: todayWorkout?.status === "completed",
      durationMinutes: todayWorkout?.durationMinutes ?? 0,
      estimatedCalories: todayWorkout?.estimatedCalories ?? 0,
      completedThisWeek,
    },

    sleep: {
      durationMinutes: sleepSummary.durationMinutes,
      durationText: sleepSummary.durationText,
      qualityScore: sleepSummary.qualityScore,
      energyScore: sleepSummary.energyScore,
      interruptions: sleepSummary.interruptions,
    },

    progress: {
      startWeightKg: progressSummary.startWeightKg,
      currentWeightKg: progressSummary.currentWeightKg,
      targetWeightKg: progressSummary.targetWeightKg,
      lostWeightKg: progressSummary.lostWeightKg,
      remainingWeightKg: progressSummary.remainingWeightKg,
      progressPercentage: progressSummary.progressPercentage,
    },
  };
}