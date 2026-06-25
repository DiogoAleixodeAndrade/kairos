import type { Meal, WaterLog } from "@/features/nutrition/nutrition.types";

type DailyNutritionSummary = {
  date: string;
  label: string;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
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

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
  });
}

function isDateInsideDay(dateValue: string, targetDate: Date) {
  const date = new Date(dateValue);

  return date >= startOfDay(targetDate) && date <= endOfDay(targetDate);
}

export function getLastSevenDaysNutritionSummary(meals: Meal[], waterLogs: WaterLog[]) {
  const today = new Date();

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dayMeals = meals.filter((meal) => isDateInsideDay(meal.eatenAt, date));
    const dayWaterLogs = waterLogs.filter((log) => isDateInsideDay(log.loggedAt, date));

    const summary = dayMeals.reduce(
      (total, meal) => {
        const mealTotals = meal.items.reduce(
          (itemTotal, item) => {
            return {
              caloriesKcal: itemTotal.caloriesKcal + item.caloriesKcal,
              proteinG: itemTotal.proteinG + item.proteinG,
              carbsG: itemTotal.carbsG + item.carbsG,
              fatG: itemTotal.fatG + item.fatG,
            };
          },
          {
            caloriesKcal: 0,
            proteinG: 0,
            carbsG: 0,
            fatG: 0,
          }
        );

        return {
          caloriesKcal: total.caloriesKcal + mealTotals.caloriesKcal,
          proteinG: total.proteinG + mealTotals.proteinG,
          carbsG: total.carbsG + mealTotals.carbsG,
          fatG: total.fatG + mealTotals.fatG,
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
      label: formatDayLabel(date),
      caloriesKcal: summary.caloriesKcal,
      proteinG: summary.proteinG,
      carbsG: summary.carbsG,
      fatG: summary.fatG,
      waterMl,
    };
  });

  return days;
}

export function getWeeklyNutritionAnalytics(days: DailyNutritionSummary[]) {
  const totalCalories = days.reduce((total, day) => total + day.caloriesKcal, 0);
  const totalProtein = days.reduce((total, day) => total + day.proteinG, 0);
  const totalCarbs = days.reduce((total, day) => total + day.carbsG, 0);
  const totalFat = days.reduce((total, day) => total + day.fatG, 0);
  const totalWater = days.reduce((total, day) => total + day.waterMl, 0);

  const bestProteinDay = [...days].sort((a, b) => b.proteinG - a.proteinG)[0];
  const highestCaloriesDay = [...days].sort((a, b) => b.caloriesKcal - a.caloriesKcal)[0];

  return {
    averageCalories: Math.round(totalCalories / 7),
    averageProtein: Math.round(totalProtein / 7),
    averageCarbs: Math.round(totalCarbs / 7),
    averageFat: Math.round(totalFat / 7),
    averageWaterMl: Math.round(totalWater / 7),
    bestProteinDay,
    highestCaloriesDay,
    maxCalories: Math.max(...days.map((day) => day.caloriesKcal), 1),
    maxProtein: Math.max(...days.map((day) => day.proteinG), 1),
  };
}