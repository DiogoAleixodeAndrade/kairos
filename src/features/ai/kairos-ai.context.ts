import { useAIStore } from "@/stores/ai.store";
import { useGamificationStore } from "@/stores/gamification.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProfileStore } from "@/stores/profile.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";
import { useTrainingStore } from "@/stores/training.store";

export function buildKairosAIContext() {
  const profile = useProfileStore.getState();
  const nutrition = useNutritionStore.getState();
  const training = useTrainingStore.getState();
  const sleep = useSleepStore.getState();
  const progress = useProgressStore.getState();
  const gamification = useGamificationStore.getState();
  const ai = useAIStore.getState();

  const todayNutrition = nutrition.getTodaySummary();
  const todayMeals = nutrition.getTodayMeals();
  const todayWorkout = training.getTodayWorkout();
  const completedWorkoutsThisWeek = training.getCompletedWorkoutsThisWeek();
  const sleepSummary = sleep.getSleepSummary();
  const progressSummary = progress.getSummary();
  const levelInfo = gamification.getLevelInfo();

  return {
    profile: {
      displayName: profile.displayName,
      age: profile.age,
      heightCm: profile.heightCm,
      objective: profile.objective,
      activityLevel: profile.activityLevel,
      autoRecalculateNutritionTargets: profile.autoRecalculateNutritionTargets,
    },

    nutrition: {
      targets: nutrition.targets,
      todaySummary: todayNutrition,
      todayMeals,
    },

    training: {
      todayWorkout,
      completedWorkoutsThisWeek,
      sessions: training.sessions.slice(0, 10),
    },

    sleep: {
      summary: sleepSummary,
      recentLogs: sleep.sleepLogs.slice(0, 7),
    },

    progress: {
      summary: progressSummary,
      recentWeights: progress.weightLogs.slice(0, 10),
      recentMeasurements: progress.measurements.slice(0, 5),
      recentPhotosCount: progress.photos.length,
    },

    gamification: {
      totalXp: gamification.totalXp,
      levelInfo,
      unlockedAchievements: gamification.unlockedAchievements,
      recentXpLogs: gamification.xpLogs.slice(0, 10),
    },

    ai: {
      previousReports: ai.reports.slice(0, 3),
    },

    generatedAt: new Date().toISOString(),
  };
}