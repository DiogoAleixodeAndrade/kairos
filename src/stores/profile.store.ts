import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProfileState = {
  isDemoMode: boolean;
  hasCompletedOnboarding: boolean;
  displayName: string;

  setDemoMode: (isDemoMode: boolean) => void;
  setDisplayName: (displayName: string) => void;
  completeOnboarding: () => void;
  resetProfileFlow: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      hasCompletedOnboarding: false,
      displayName: "Diogo",

      setDemoMode: (isDemoMode) => {
        set({ isDemoMode });
      },

      setDisplayName: (displayName) => {
        set({ displayName });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetProfileFlow: () => {
        set({
          isDemoMode: false,
          hasCompletedOnboarding: false,
          displayName: "Diogo",
        });
      },
    }),
    {
      name: "kairos-profile-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);