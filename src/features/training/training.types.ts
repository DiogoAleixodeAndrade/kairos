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