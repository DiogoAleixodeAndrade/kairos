import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Workout, WorkoutSession } from "@/features/training/training.types";

type TrainingState = {
  workouts: Workout[];
  sessions: WorkoutSession[];

  getTodayWorkout: () => Workout | null;
  completeTodayWorkout: () => void;
  skipTodayWorkout: () => void;
  addSession: (session: Omit<WorkoutSession, "id">) => void;
  getCompletedWorkoutsThisWeek: () => number;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isToday(date: string) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function isThisWeek(date: string) {
  const now = new Date();
  const target = new Date(date);

  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - now.getDay());
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  return target >= firstDayOfWeek && target <= lastDayOfWeek;
}

const today = new Date().toISOString();

const demoWorkouts: Workout[] = [
  {
    id: "push-day-demo",
    title: "Push Day",
    subtitle: "Peito • Ombros • Tríceps",
    scheduledFor: today,
    durationMinutes: 60,
    estimatedCalories: 480,
    status: "planned",
    exercises: [
      {
        id: "supino-reto",
        name: "Supino reto",
        muscleGroup: "Peito",
        targetSets: 4,
        targetReps: "8–10",
        targetWeightKg: 80,
        restSeconds: 90,
      },
      {
        id: "supino-inclinado",
        name: "Supino inclinado",
        muscleGroup: "Peito",
        targetSets: 4,
        targetReps: "8–10",
        targetWeightKg: 70,
        restSeconds: 90,
      },
      {
        id: "desenvolvimento",
        name: "Desenvolvimento",
        muscleGroup: "Ombros",
        targetSets: 4,
        targetReps: "8–10",
        targetWeightKg: 40,
        restSeconds: 90,
      },
      {
        id: "elevacao-lateral",
        name: "Elevação lateral",
        muscleGroup: "Ombros",
        targetSets: 4,
        targetReps: "12–15",
        targetWeightKg: 12,
        restSeconds: 60,
      },
      {
        id: "triceps-corda",
        name: "Tríceps corda",
        muscleGroup: "Tríceps",
        targetSets: 4,
        targetReps: "10–12",
        targetWeightKg: 35,
        restSeconds: 60,
      },
    ],
  },
];

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      workouts: demoWorkouts,
      sessions: [],

      getTodayWorkout: () => {
        return get().workouts.find((workout) => isToday(workout.scheduledFor)) ?? null;
      },

      completeTodayWorkout: () =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            isToday(workout.scheduledFor)
              ? {
                  ...workout,
                  status: "completed",
                }
              : workout
          ),
        })),

      skipTodayWorkout: () =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            isToday(workout.scheduledFor)
              ? {
                  ...workout,
                  status: "skipped",
                }
              : workout
          ),
        })),

      addSession: (session) =>
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id: createId(),
            },
          ],
        })),

      getCompletedWorkoutsThisWeek: () => {
        return get().sessions.filter((session) => isThisWeek(session.startedAt)).length;
      },
    }),
    {
      name: "kairos-training-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);