import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  FoodEntry,
  Meal,
  NutritionSummary,
  NutritionTargets,
  WaterLog,
} from "@/features/nutrition/nutrition.types";

type NutritionState = {
  targets: NutritionTargets;
  meals: Meal[];
  waterLogs: WaterLog[];

  setTargets: (targets: NutritionTargets) => void;
  addMeal: (meal: Omit<Meal, "id">) => void;
  removeMeal: (mealId: string) => void;
  addWater: (amountMl: number) => void;
  clearTodayWater: () => void;
  updateMeal: (mealId: string, meal: Omit<Meal, "id">) => void;
  getTodayMeals: () => Meal[];
  getTodayWaterLogs: () => WaterLog[];
  getTodaySummary: () => NutritionSummary;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isToday(date: string) {
  return new Date(date).toDateString() === new Date().toDateString();
}

const demoMeals: Meal[] = [
  {
    id: "demo-breakfast",
    title: "Café da manhã",
    mealType: "breakfast",
    eatenAt: new Date().toISOString(),
    items: [
      {
        id: "demo-breakfast-1",
        foodName: "Pão com ovos",
        quantityG: 180,
        caloriesKcal: 430,
        proteinG: 28,
        carbsG: 42,
        fatG: 16,
      },
    ],
  },
  {
    id: "demo-lunch",
    title: "Almoço",
    mealType: "lunch",
    eatenAt: new Date().toISOString(),
    items: [
      {
        id: "demo-lunch-1",
        foodName: "Arroz, feijão e frango",
        quantityG: 420,
        caloriesKcal: 620,
        proteinG: 48,
        carbsG: 72,
        fatG: 14,
      },
    ],
  },
];

const demoWaterLogs: WaterLog[] = [
  {
    id: "demo-water-1",
    amountMl: 500,
    loggedAt: new Date().toISOString(),
  },
  {
    id: "demo-water-2",
    amountMl: 500,
    loggedAt: new Date().toISOString(),
  },
  {
    id: "demo-water-3",
    amountMl: 500,
    loggedAt: new Date().toISOString(),
  },
];

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      targets: {
        caloriesKcal: 2600,
        proteinG: 190,
        carbsG: 260,
        fatG: 80,
        waterMl: 3000,
      },

      meals: demoMeals,
      waterLogs: demoWaterLogs,

      setTargets: (targets) => set({ targets }),

      addMeal: (meal) =>
        set((state) => ({
          meals: [
            ...state.meals,
            {
              ...meal,
              id: createId(),
              items: meal.items.map((item) => ({
                ...item,
                id: item.id || createId(),
              })),
            },
          ],
        })),

      removeMeal: (mealId) =>
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== mealId),
        })),

      updateMeal: (mealId, meal) =>
        set((state) => ({
          meals: state.meals.map((item) =>
            item.id === mealId
              ? {
                  ...meal,
                  id: mealId,
                  items: meal.items.map((mealItem) => ({
                    ...mealItem,
                    id: mealItem.id || createId(),
                  })),
                }
              : item,
          ),
        })),

      addWater: (amountMl) =>
        set((state) => ({
          waterLogs: [
            ...state.waterLogs,
            {
              id: createId(),
              amountMl,
              loggedAt: new Date().toISOString(),
            },
          ],
        })),

      clearTodayWater: () =>
        set((state) => ({
          waterLogs: state.waterLogs.filter((log) => !isToday(log.loggedAt)),
        })),

      getTodayMeals: () => {
        return get().meals.filter((meal) => isToday(meal.eatenAt));
      },

      getTodayWaterLogs: () => {
        return get().waterLogs.filter((log) => isToday(log.loggedAt));
      },

      getTodaySummary: () => {
        const todayMeals = get().getTodayMeals();
        const todayWaterLogs = get().getTodayWaterLogs();

        return todayMeals.reduce<NutritionSummary>(
          (summary, meal) => {
            meal.items.forEach((item) => {
              summary.caloriesKcal += item.caloriesKcal;
              summary.proteinG += item.proteinG;
              summary.carbsG += item.carbsG;
              summary.fatG += item.fatG;
            });

            return summary;
          },
          {
            caloriesKcal: 0,
            proteinG: 0,
            carbsG: 0,
            fatG: 0,
            waterMl: todayWaterLogs.reduce(
              (total, log) => total + log.amountMl,
              0,
            ),
          },
        );
      },
    }),
    {
      name: "kairos-nutrition-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
