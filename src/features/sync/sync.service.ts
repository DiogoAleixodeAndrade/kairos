import type {
  AppSyncSnapshotRow,
  KairosSyncPayload,
} from "@/features/sync/sync.types";
import { supabase } from "@/lib/supabase";
import { useAIStore } from "@/stores/ai.store";
import { useGamificationStore } from "@/stores/gamification.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";
import { useTrainingStore } from "@/stores/training.store";
import { useProfileStore } from "@/stores/profile.store";

async function getAuthenticatedUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user?.id) {
    throw new Error(
      "Você precisa estar logado para sincronizar com o Supabase.",
    );
  }

  return data.user.id;
}

export function buildKairosSyncPayload(): KairosSyncPayload {
  const nutrition = useNutritionStore.getState();
  const training = useTrainingStore.getState();
  const sleep = useSleepStore.getState();
  const progress = useProgressStore.getState();
  const ai = useAIStore.getState();
  const gamification = useGamificationStore.getState();
  const profile = useProfileStore.getState();

  return {
    version: 1,
    syncedAt: new Date().toISOString(),

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
      meals: nutrition.meals,
      waterLogs: nutrition.waterLogs,
    },

    training: {
      workouts: training.workouts,
      sessions: training.sessions,
    },

    sleep: {
      sleepLogs: sleep.sleepLogs,
    },

    progress: {
      startWeightKg: progress.startWeightKg,
      targetWeightKg: progress.targetWeightKg,
      weightLogs: progress.weightLogs,
      measurements: progress.measurements,
      photos: progress.photos,
    },

    ai: {
      reports: ai.reports,
      messages: ai.messages,
    },

    gamification: {
      totalXp: gamification.totalXp,
      xpLogs: gamification.xpLogs,
      unlockedAchievements: gamification.unlockedAchievements,
    },
  };
}

export function applyKairosSyncPayload(payload: KairosSyncPayload) {
  if (payload.profile) {
    useProfileStore.setState({
      displayName: payload.profile.displayName,
      age: payload.profile.age,
      heightCm: payload.profile.heightCm,
      objective: payload.profile.objective,
      activityLevel: payload.profile.activityLevel,
      autoRecalculateNutritionTargets:
        payload.profile.autoRecalculateNutritionTargets,
    });
  }

  useNutritionStore.setState({
    targets: payload.nutrition.targets,
    meals: payload.nutrition.meals,
    waterLogs: payload.nutrition.waterLogs,
  });

  useTrainingStore.setState({
    workouts: payload.training.workouts,
    sessions: payload.training.sessions,
  });

  useSleepStore.setState({
    sleepLogs: payload.sleep.sleepLogs,
  });

  useProgressStore.setState({
    startWeightKg: payload.progress.startWeightKg,
    targetWeightKg: payload.progress.targetWeightKg,
    weightLogs: payload.progress.weightLogs,
    measurements: payload.progress.measurements,
    photos: payload.progress.photos,
  });

  useAIStore.setState({
    reports: payload.ai.reports,
    messages: payload.ai.messages,
  });

  useGamificationStore.setState({
    totalXp: payload.gamification.totalXp,
    xpLogs: payload.gamification.xpLogs,
    unlockedAchievements: payload.gamification.unlockedAchievements,
  });
}

export async function syncLocalDataToSupabase() {
  const userId = await getAuthenticatedUserId();
  const payload = buildKairosSyncPayload();
  const now = new Date().toISOString();

  const { error } = await supabase.from("app_sync_snapshots").upsert(
    {
      user_id: userId,
      payload,
      synced_at: now,
      updated_at: now,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    syncedAt: now,
  };
}

export async function restoreLocalDataFromSupabase() {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("app_sync_snapshots")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<AppSyncSnapshotRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.payload) {
    throw new Error("Nenhum backup encontrado no Supabase para esta conta.");
  }

  applyKairosSyncPayload(data.payload);

  return {
    syncedAt: data.synced_at,
  };
}
