import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Exercise,
  GeneratedTrainingPlan,
  WeeklyPlan,
  Workout,
  WorkoutSession,
} from "@/features/training/training.types";

type TrainingState = {
  workouts: Workout[];
  sessions: WorkoutSession[];
  weeklyPlan: WeeklyPlan;

  // leitura
  getTodayWorkout: () => Workout | null;
  getWorkoutForWeekday: (weekday: number) => Workout | null;
  getWorkoutById: (workoutId: string) => Workout | null;
  getCompletedWorkoutsThisWeek: () => number;
  getRecentSessions: (limit?: number) => WorkoutSession[];
  getSessionById: (sessionId: string) => WorkoutSession | null;

  // plano semanal
  setPlanForWeekday: (weekday: number, workoutId: string | null) => void;
  applyGeneratedPlan: (plan: GeneratedTrainingPlan) => void;

  // edição de exercícios do treino
  addExercise: (workoutId: string, exercise: Omit<Exercise, "id">) => void;
  updateExercise: (
    workoutId: string,
    exerciseId: string,
    patch: Partial<Omit<Exercise, "id">>
  ) => void;
  removeExercise: (workoutId: string, exerciseId: string) => void;

  // sessões
  addSession: (session: Omit<WorkoutSession, "id">) => void;
  removeSession: (sessionId: string) => void;

  // status do treino
  completeTodayWorkout: () => void;
  skipTodayWorkout: () => void;
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

const pushDay: Workout = {
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
};

const pullDay: Workout = {
  id: "pull-day-demo",
  title: "Pull Day",
  subtitle: "Costas • Bíceps",
  scheduledFor: today,
  durationMinutes: 60,
  estimatedCalories: 460,
  status: "planned",
  exercises: [
    {
      id: "barra-fixa",
      name: "Barra fixa",
      muscleGroup: "Costas",
      targetSets: 4,
      targetReps: "6–10",
      restSeconds: 90,
    },
    {
      id: "remada-curvada",
      name: "Remada curvada",
      muscleGroup: "Costas",
      targetSets: 4,
      targetReps: "8–10",
      targetWeightKg: 60,
      restSeconds: 90,
    },
    {
      id: "puxada-frente",
      name: "Puxada frente",
      muscleGroup: "Costas",
      targetSets: 3,
      targetReps: "10–12",
      targetWeightKg: 55,
      restSeconds: 75,
    },
    {
      id: "rosca-direta",
      name: "Rosca direta",
      muscleGroup: "Bíceps",
      targetSets: 3,
      targetReps: "10–12",
      targetWeightKg: 25,
      restSeconds: 60,
    },
  ],
};

const legDay: Workout = {
  id: "leg-day-demo",
  title: "Leg Day",
  subtitle: "Quadríceps • Posterior • Panturrilha",
  scheduledFor: today,
  durationMinutes: 65,
  estimatedCalories: 520,
  status: "planned",
  exercises: [
    {
      id: "agachamento",
      name: "Agachamento livre",
      muscleGroup: "Quadríceps",
      targetSets: 4,
      targetReps: "6–8",
      targetWeightKg: 100,
      restSeconds: 120,
    },
    {
      id: "leg-press",
      name: "Leg press",
      muscleGroup: "Quadríceps",
      targetSets: 4,
      targetReps: "10–12",
      targetWeightKg: 180,
      restSeconds: 90,
    },
    {
      id: "stiff",
      name: "Stiff",
      muscleGroup: "Posterior",
      targetSets: 3,
      targetReps: "10–12",
      targetWeightKg: 70,
      restSeconds: 90,
    },
    {
      id: "panturrilha",
      name: "Panturrilha em pé",
      muscleGroup: "Panturrilha",
      targetSets: 4,
      targetReps: "12–15",
      targetWeightKg: 90,
      restSeconds: 45,
    },
  ],
};

const demoWorkouts: Workout[] = [pushDay, pullDay, legDay];

// Divisão semanal padrão (0 = domingo)
// Seg Push, Ter Pull, Qua Leg, Qui Push, Sex Pull, Sáb/Dom descanso
const defaultWeeklyPlan: WeeklyPlan = [
  null, // domingo
  "push-day-demo", // segunda
  "pull-day-demo", // terça
  "leg-day-demo", // quarta
  "push-day-demo", // quinta
  "pull-day-demo", // sexta
  null, // sábado
];

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      workouts: demoWorkouts,
      sessions: [],
      weeklyPlan: defaultWeeklyPlan,

      getWorkoutForWeekday: (weekday) => {
        const plan = get().weeklyPlan;
        const workoutId = plan[weekday] ?? null;

        if (!workoutId) return null;

        return get().workouts.find((workout) => workout.id === workoutId) ?? null;
      },

      getTodayWorkout: () => {
        return get().getWorkoutForWeekday(new Date().getDay());
      },

      getWorkoutById: (workoutId) => {
        return get().workouts.find((workout) => workout.id === workoutId) ?? null;
      },

      getCompletedWorkoutsThisWeek: () => {
        return get().sessions.filter((session) => isThisWeek(session.startedAt)).length;
      },

      getRecentSessions: (limit = 30) => {
        return [...get().sessions]
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, limit);
      },

      getSessionById: (sessionId) => {
        return get().sessions.find((session) => session.id === sessionId) ?? null;
      },

      setPlanForWeekday: (weekday, workoutId) =>
        set((state) => {
          const nextPlan = [...state.weeklyPlan];
          nextPlan[weekday] = workoutId;

          return { weeklyPlan: nextPlan };
        }),

      applyGeneratedPlan: (plan) => {
        const scheduledFor = new Date().toISOString();

        const workouts: Workout[] = plan.workouts.map((workout) => ({
          id: workout.id,
          title: workout.title,
          subtitle: workout.subtitle,
          scheduledFor,
          durationMinutes: workout.durationMinutes,
          estimatedCalories: workout.estimatedCalories,
          status: "planned",
          exercises: workout.exercises.map((exercise) => ({
            id: createId(),
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            restSeconds: exercise.restSeconds,
          })),
        }));

        const validIds = new Set(workouts.map((workout) => workout.id));

        // garante 7 posições e só mantém ids válidos
        const weeklyPlan: WeeklyPlan = Array.from({ length: 7 }).map((_, index) => {
          const id = plan.weeklyPlan[index] ?? null;
          return id && validIds.has(id) ? id : null;
        });

        set({ workouts, weeklyPlan });
      },

      addExercise: (workoutId, exercise) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: [...workout.exercises, { ...exercise, id: createId() }],
                }
              : workout
          ),
        })),

      updateExercise: (workoutId, exerciseId, patch) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map((exercise) =>
                    exercise.id === exerciseId ? { ...exercise, ...patch } : exercise
                  ),
                }
              : workout
          ),
        })),

      removeExercise: (workoutId, exerciseId) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.filter((exercise) => exercise.id !== exerciseId),
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

      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== sessionId),
        })),

      completeTodayWorkout: () =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            isToday(workout.scheduledFor) ? { ...workout, status: "completed" } : workout
          ),
        })),

      skipTodayWorkout: () =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            isToday(workout.scheduledFor) ? { ...workout, status: "skipped" } : workout
          ),
        })),
    }),
    {
      name: "kairos-training-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted: any) => {
        if (persisted && !persisted.weeklyPlan) {
          persisted.weeklyPlan = defaultWeeklyPlan;
        }
        return persisted;
      },
    }
  )
);
