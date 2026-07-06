import type { WeeklyTrainingSummary, WorkoutSession } from "@/features/training/training.types";
import { useTrainingStore } from "@/stores/training.store";

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

// Volume = soma de (reps × carga) apenas das séries concluídas
export function computeSessionVolume(session: WorkoutSession): number {
  return session.setLogs.reduce((total, setLog) => {
    if (!setLog.completed) return total;
    return total + setLog.reps * setLog.weightKg;
  }, 0);
}

export function countCompletedSets(session: WorkoutSession): number {
  return session.setLogs.filter((setLog) => setLog.completed).length;
}

export function getWeeklyTrainingSummary(): WeeklyTrainingSummary {
  const sessions = useTrainingStore.getState().sessions;
  const weekSessions = sessions.filter((session) => isThisWeek(session.startedAt));

  const totalVolumeKg = weekSessions.reduce(
    (total, session) => total + computeSessionVolume(session),
    0
  );

  const totalMinutes = weekSessions.reduce(
    (total, session) => total + (session.durationMinutes ?? 0),
    0
  );

  const totalCalories = weekSessions.reduce(
    (total, session) => total + (session.estimatedCalories ?? 0),
    0
  );

  const completedSets = weekSessions.reduce(
    (total, session) => total + countCompletedSets(session),
    0
  );

  const sessionsThisWeek = weekSessions.length;

  return {
    sessionsThisWeek,
    totalVolumeKg: Math.round(totalVolumeKg),
    totalMinutes,
    avgDurationMinutes: sessionsThisWeek > 0 ? Math.round(totalMinutes / sessionsThisWeek) : 0,
    totalCalories,
    completedSets,
  };
}

// Sequência de dias distintos com pelo menos uma sessão, terminando hoje ou ontem
export function getTrainingStreak(): number {
  const sessions = useTrainingStore.getState().sessions;

  if (sessions.length === 0) return 0;

  const daysWithSession = new Set(
    sessions.map((session) => new Date(session.startedAt).toDateString())
  );

  let streak = 0;
  const cursor = new Date();

  // permite que a sequência ainda conte se o usuário não treinou hoje mas treinou ontem
  if (!daysWithSession.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!daysWithSession.has(cursor.toDateString())) {
      return 0;
    }
  }

  while (daysWithSession.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
