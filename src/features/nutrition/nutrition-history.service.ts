import type { Meal, WaterLog } from "@/features/nutrition/nutrition.types";

export type NutritionHistoryPeriod = 7 | 14 | 30;

export type NutritionHistoryMealSummary = {
  id: string;
  title: string;
  mealType: Meal["mealType"];
  eatenAt: string;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type NutritionHistoryDay = {
  date: string;
  label: string;
  fullLabel: string;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
  meals: NutritionHistoryMealSummary[];
};

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);

  return result;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatShortLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
  });
}

function formatFullLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function isDateInsideDay(dateValue: string, targetDate: Date) {
  const date = new Date(dateValue);

  return date >= startOfDay(targetDate) && date <= endOfDay(targetDate);
}

function getMealTotals(meal: Meal) {
  return meal.items.reduce(
    (total, item) => {
      return {
        caloriesKcal: total.caloriesKcal + item.caloriesKcal,
        proteinG: total.proteinG + item.proteinG,
        carbsG: total.carbsG + item.carbsG,
        fatG: total.fatG + item.fatG,
      };
    },
    {
      caloriesKcal: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    }
  );
}

export function getNutritionHistoryByPeriod(
  meals: Meal[],
  waterLogs: WaterLog[],
  period: NutritionHistoryPeriod
) {
  const today = new Date();

  return Array.from({ length: period }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (period - 1 - index));

    const dayMeals = meals
      .filter((meal) => isDateInsideDay(meal.eatenAt, date))
      .sort((a, b) => new Date(b.eatenAt).getTime() - new Date(a.eatenAt).getTime());

    const dayWaterLogs = waterLogs.filter((log) => isDateInsideDay(log.loggedAt, date));

    const mealSummaries = dayMeals.map((meal) => {
      const totals = getMealTotals(meal);

      return {
        id: meal.id,
        title: meal.title,
        mealType: meal.mealType,
        eatenAt: meal.eatenAt,
        caloriesKcal: totals.caloriesKcal,
        proteinG: totals.proteinG,
        carbsG: totals.carbsG,
        fatG: totals.fatG,
      };
    });

    const dayTotals = mealSummaries.reduce(
      (total, meal) => {
        return {
          caloriesKcal: total.caloriesKcal + meal.caloriesKcal,
          proteinG: total.proteinG + meal.proteinG,
          carbsG: total.carbsG + meal.carbsG,
          fatG: total.fatG + meal.fatG,
        };
      },
      {
        caloriesKcal: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
      }
    );

    const waterMl = dayWaterLogs.reduce((total, log) => total + log.amountMl, 0);

    return {
      date: formatDateKey(date),
      label: formatShortLabel(date),
      fullLabel: formatFullLabel(date),
      caloriesKcal: dayTotals.caloriesKcal,
      proteinG: dayTotals.proteinG,
      carbsG: dayTotals.carbsG,
      fatG: dayTotals.fatG,
      waterMl,
      meals: mealSummaries,
    };
  });
}

export function getNutritionHistoryTotals(days: NutritionHistoryDay[]) {
  const activeDays = days.filter((day) => day.caloriesKcal > 0 || day.meals.length > 0);

  const totals = days.reduce(
    (total, day) => {
      return {
        caloriesKcal: total.caloriesKcal + day.caloriesKcal,
        proteinG: total.proteinG + day.proteinG,
        carbsG: total.carbsG + day.carbsG,
        fatG: total.fatG + day.fatG,
        waterMl: total.waterMl + day.waterMl,
        mealsCount: total.mealsCount + day.meals.length,
      };
    },
    {
      caloriesKcal: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      waterMl: 0,
      mealsCount: 0,
    }
  );

  const divisor = Math.max(activeDays.length, 1);

  return {
    ...totals,
    activeDaysCount: activeDays.length,
    averageCalories: Math.round(totals.caloriesKcal / divisor),
    averageProtein: Math.round(totals.proteinG / divisor),
    averageCarbs: Math.round(totals.carbsG / divisor),
    averageFat: Math.round(totals.fatG / divisor),
    averageWaterMl: Math.round(totals.waterMl / divisor),
    maxCalories: Math.max(...days.map((day) => day.caloriesKcal), 1),
  };
}