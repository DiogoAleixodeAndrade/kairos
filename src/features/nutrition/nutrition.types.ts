export type MealType = "breakfast" | "lunch" | "snack" | "dinner" | "supper" | "other";

export type FoodEntry = {
  id: string;
  foodName: string;
  quantityG: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type Meal = {
  id: string;
  title: string;
  mealType: MealType;
  eatenAt: string;
  notes?: string;
  items: FoodEntry[];
};

export type WaterLog = {
  id: string;
  amountMl: number;
  loggedAt: string;
};

export type NutritionTargets = {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
};

export type NutritionSummary = {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
};