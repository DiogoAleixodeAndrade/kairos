import { calculateNutritionTargets } from "@/features/nutrition/nutrition-goals.service";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProfileStore } from "@/stores/profile.store";

export function recalculateNutritionTargetsFromWeight(currentWeightKg: number) {
  const profile = useProfileStore.getState();

  if (!profile.autoRecalculateNutritionTargets) {
    return null;
  }

  const targets = calculateNutritionTargets({
    age: profile.age,
    heightCm: profile.heightCm,
    currentWeightKg,
    objective: profile.objective,
    activityLevel: profile.activityLevel,
  });

  useNutritionStore.getState().setTargets(targets);

  return targets;
}