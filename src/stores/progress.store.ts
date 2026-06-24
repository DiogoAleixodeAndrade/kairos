import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  BodyMeasurement,
  ProgressPhoto,
  ProgressPhotoType,
  ProgressSummary,
  WeightLog,
} from "@/features/progress/progress.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProgressState = {
  startWeightKg: number;
  targetWeightKg: number;
  weightLogs: WeightLog[];
  measurements: BodyMeasurement[];
  photos: ProgressPhoto[];

  setJourneyWeights: (data: {
    startWeightKg: number;
    currentWeightKg: number;
    targetWeightKg: number;
  }) => void;

  addWeightLog: (data: Omit<WeightLog, "id" | "loggedAt">) => void;
  addMeasurement: (data: Omit<BodyMeasurement, "id" | "measuredAt">) => void;
  addPhoto: (data: { uri: string; type: ProgressPhotoType; notes?: string }) => void;

  getCurrentWeight: () => number;
  getLatestMeasurement: () => BodyMeasurement | null;
  getLatestPhoto: () => ProgressPhoto | null;
  getSummary: () => ProgressSummary;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const demoWeightLogs: WeightLog[] = [
  {
    id: "demo-weight-start",
    weightKg: 185,
    loggedAt: "2024-12-01T12:00:00.000Z",
    notes: "Início da jornada.",
  },
  {
    id: "demo-weight-current",
    weightKg: 145,
    loggedAt: new Date().toISOString(),
    notes: "Peso atual.",
  },
];

const demoMeasurements: BodyMeasurement[] = [
  {
    id: "demo-measurement",
    measuredAt: new Date().toISOString(),
    neckCm: 45,
    chestCm: 122,
    waistCm: 128,
    abdomenCm: 136,
    hipCm: 124,
    armCm: 42,
    thighCm: 72,
    calfCm: 45,
    notes: "Medidas iniciais de exemplo.",
  },
];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      startWeightKg: 185,
      targetWeightKg: 120,
      weightLogs: demoWeightLogs,
      measurements: demoMeasurements,
      photos: [],

      setJourneyWeights: ({ startWeightKg, currentWeightKg, targetWeightKg }) =>
        set((state) => ({
          startWeightKg,
          targetWeightKg,
          weightLogs: [
            ...state.weightLogs,
            {
              id: createId(),
              weightKg: currentWeightKg,
              loggedAt: new Date().toISOString(),
              notes: "Peso informado no onboarding.",
            },
          ],
        })),

      addWeightLog: ({ weightKg, notes }) =>
        set((state) => ({
          weightLogs: [
            {
              id: createId(),
              weightKg,
              loggedAt: new Date().toISOString(),
              notes,
            },
            ...state.weightLogs,
          ],
        })),

      addMeasurement: (data) =>
        set((state) => ({
          measurements: [
            {
              id: createId(),
              measuredAt: new Date().toISOString(),
              ...data,
            },
            ...state.measurements,
          ],
        })),

      addPhoto: ({ uri, type, notes }) =>
        set((state) => ({
          photos: [
            {
              id: createId(),
              uri,
              type,
              takenAt: new Date().toISOString(),
              notes,
            },
            ...state.photos,
          ],
        })),

      getCurrentWeight: () => {
        const latestWeight = get().weightLogs[0];

        return latestWeight?.weightKg ?? get().startWeightKg;
      },

      getLatestMeasurement: () => {
        return get().measurements[0] ?? null;
      },

      getLatestPhoto: () => {
        return get().photos[0] ?? null;
      },

      getSummary: () => {
        const startWeightKg = get().startWeightKg;
        const currentWeightKg = get().getCurrentWeight();
        const targetWeightKg = get().targetWeightKg;
        const latestMeasurement = get().getLatestMeasurement();
        const latestPhoto = get().getLatestPhoto();

        const lostWeightKg = Math.max(0, startWeightKg - currentWeightKg);
        const remainingWeightKg = Math.max(0, currentWeightKg - targetWeightKg);
        const totalGoal = Math.max(1, startWeightKg - targetWeightKg);
        const progressPercentage = Math.min(100, Math.round((lostWeightKg / totalGoal) * 100));

        return {
          startWeightKg,
          currentWeightKg,
          targetWeightKg,
          lostWeightKg,
          remainingWeightKg,
          progressPercentage,
          latestWaistCm: latestMeasurement?.waistCm,
          latestPhotoUri: latestPhoto?.uri,
        };
      },
    }),
    {
      name: "kairos-progress-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);