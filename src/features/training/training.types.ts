export type WorkoutStatus = "planned" | "completed" | "skipped";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: string;
  targetWeightKg?: number;
  restSeconds: number;
};

export type Workout = {
  id: string;
  title: string;
  subtitle: string;
  scheduledFor: string;
  durationMinutes: number;
  estimatedCalories: number;
  status: WorkoutStatus;
  exercises: Exercise[];
  notes?: string;
};

export type WorkoutSetLog = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
};

export type WorkoutSession = {
  id: string;
  workoutId: string;
  title: string;
  startedAt: string;
  finishedAt?: string;
  durationMinutes?: number;
  estimatedCalories?: number;
  setLogs: WorkoutSetLog[];
  notes?: string;
};

// 0 = domingo ... 6 = sábado (mesma base de Date.getDay())
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// length 7, weekday -> workoutId (ou null se descanso)
export type WeeklyPlan = (string | null)[];

export type WeeklyTrainingSummary = {
  sessionsThisWeek: number;
  totalVolumeKg: number;
  totalMinutes: number;
  avgDurationMinutes: number;
  totalCalories: number;
  completedSets: number;
};