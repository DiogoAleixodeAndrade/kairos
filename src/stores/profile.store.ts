import type {
  ActivityLevel,
  NutritionObjective,
} from "@/features/nutrition/nutrition-goals.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProfileState = {
  isDemoMode: boolean;
  hasCompletedOnboarding: boolean;
  displayName: string;

  age: number;
  heightCm: number;
  objective: NutritionObjective;
  activityLevel: ActivityLevel;
  autoRecalculateNutritionTargets: boolean;

  setDemoMode: (isDemoMode: boolean) => void;
  setDisplayName: (displayName: string) => void;
  setNutritionProfile: (data: {
    age: number;
    heightCm: number;
    objective: NutritionObjective;
    activityLevel: ActivityLevel;
  }) => void;
  setAutoRecalculateNutritionTargets: (enabled: boolean) => void;
  completeOnboarding: () => void;
  resetProfileFlow: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      hasCompletedOnboarding: false,
      displayName: "Diogo",

      age: 25,
      heightCm: 180,
      objective: "cut",
      activityLevel: "moderate",
      autoRecalculateNutritionTargets: true,

      setDemoMode: (isDemoMode) => {
        set({ isDemoMode });
      },

      setDisplayName: (displayName) => {
        set({ displayName });
      },

      setNutritionProfile: (data) => {
        set({
          age: data.age,
          heightCm: data.heightCm,
          objective: data.objective,
          activityLevel: data.activityLevel,
        });
      },

      setAutoRecalculateNutritionTargets: (enabled) => {
        set({
          autoRecalculateNutritionTargets: enabled,
        });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetProfileFlow: () => {
        set({
          isDemoMode: false,
          hasCompletedOnboarding: false,
          displayName: "Diogo",
          age: 25,
          heightCm: 180,
          objective: "cut",
          activityLevel: "moderate",
          autoRecalculateNutritionTargets: true,
        });
      },
    }),
    {
      name: "kairos-profile-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);