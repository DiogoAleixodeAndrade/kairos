import type { NutritionTargets } from "@/features/nutrition/nutrition.types";

export type NutritionObjective = "cut" | "maintain" | "gain";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "high" | "athlete";

type CalculateNutritionTargetsInput = {
  age: number;
  heightCm: number;
  currentWeightKg: number;
  objective: NutritionObjective;
  activityLevel: ActivityLevel;
};

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9,
};

export function calculateNutritionTargets({
  age,
  heightCm,
  currentWeightKg,
  objective,
  activityLevel,
}: CalculateNutritionTargetsInput): NutritionTargets {
  const safeAge = Math.max(age, 16);
  const safeHeight = Math.max(heightCm, 120);
  const safeWeight = Math.max(currentWeightKg, 40);

  const bmr = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5;
  const tdee = bmr * activityMultipliers[activityLevel];

  const caloriesMultiplier = {
    cut: 0.82,
    maintain: 1,
    gain: 1.12,
  }[objective];

  const caloriesKcal = Math.round(tdee * caloriesMultiplier);

  const proteinPerKg = {
    cut: 2.1,
    maintain: 1.8,
    gain: 1.9,
  }[objective];

  const fatPerKg = {
    cut: 0.75,
    maintain: 0.85,
    gain: 0.9,
  }[objective];

  const proteinG = Math.round(safeWeight * proteinPerKg);
  const fatG = Math.round(safeWeight * fatPerKg);

  const caloriesFromProtein = proteinG * 4;
  const caloriesFromFat = fatG * 9;
  const remainingCalories = Math.max(0, caloriesKcal - caloriesFromProtein - caloriesFromFat);
  const carbsG = Math.round(remainingCalories / 4);

  const waterMl = Math.round((safeWeight * 35) / 100) * 100;

  return {
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
    waterMl,
  };
}