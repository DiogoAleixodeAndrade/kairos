import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SleepLog, SleepSummary } from "@/features/sleep/sleep.types";

type SleepState = {
  sleepLogs: SleepLog[];

  addSleepLog: (sleepLog: Omit<SleepLog, "id">) => void;
  getLastSleepLog: () => SleepLog | null;
  getSleepSummary: () => SleepSummary;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h${String(remainingMinutes).padStart(2, "0")}min`;
}

const demoSleepLogs: SleepLog[] = [
  {
    id: "demo-sleep",
    sleptAt: new Date().toISOString(),
    wokeUpAt: new Date().toISOString(),
    durationMinutes: 402,
    qualityScore: 7,
    energyScore: 7,
    interruptions: 1,
    notes: "Sono razoável, mas poderia dormir mais cedo.",
  },
];

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      sleepLogs: demoSleepLogs,

      addSleepLog: (sleepLog) =>
        set((state) => ({
          sleepLogs: [
            {
              ...sleepLog,
              id: createId(),
            },
            ...state.sleepLogs,
          ],
        })),

      getLastSleepLog: () => {
        return get().sleepLogs[0] ?? null;
      },

      getSleepSummary: () => {
        const lastSleepLog = get().getLastSleepLog();

        if (!lastSleepLog) {
          return {
            durationMinutes: 0,
            durationText: "0h00min",
            qualityScore: 0,
            energyScore: 0,
            interruptions: 0,
          };
        }

        return {
          durationMinutes: lastSleepLog.durationMinutes,
          durationText: formatDuration(lastSleepLog.durationMinutes),
          qualityScore: lastSleepLog.qualityScore,
          energyScore: lastSleepLog.energyScore,
          interruptions: lastSleepLog.interruptions,
        };
      },
    }),
    {
      name: "kairos-sleep-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);