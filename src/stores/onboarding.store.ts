import { create } from "zustand";

type JourneyMode = "from_scratch" | "with_history";

type OnboardingState = {
  journeyMode: JourneyMode;
  name: string;
  age: string;
  currentWeightKg: string;
  heightCm: string;
  journeyStartDate: string;
  journeyStartWeightKg: string;
  targetWeightKg: string;

  setJourneyMode: (journeyMode: JourneyMode) => void;
  setPhysicalData: (data: {
    name: string;
    age: string;
    currentWeightKg: string;
    heightCm: string;
  }) => void;
  setJourneyHistory: (data: {
    journeyStartDate: string;
    journeyStartWeightKg: string;
    targetWeightKg: string;
  }) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  journeyMode: "from_scratch",
  name: "",
  age: "",
  currentWeightKg: "",
  heightCm: "",
  journeyStartDate: "",
  journeyStartWeightKg: "",
  targetWeightKg: "",

  setJourneyMode: (journeyMode) => set({ journeyMode }),

  setPhysicalData: (data) => set(data),

  setJourneyHistory: (data) => set(data),

  reset: () =>
    set({
      journeyMode: "from_scratch",
      name: "",
      age: "",
      currentWeightKg: "",
      heightCm: "",
      journeyStartDate: "",
      journeyStartWeightKg: "",
      targetWeightKg: "",
    }),
}));