import type { BodyMeasurement } from "@/features/progress/progress.types";
import { useProfileStore } from "@/stores/profile.store";
import { useProgressStore } from "@/stores/progress.store";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type WeightPoint = {
  weightKg: number;
  loggedAt: string;
};

export type MeasurementDelta = {
  key: string;
  label: string;
  current: number;
  previous?: number;
  deltaCm?: number;
};

export type ProgressAnalytics = {
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  objective: string; // cut | maintain | gain
  remainingKg: number; // sempre positivo
  weeklyRateKg: number; // sinalizado: negativo = perdendo
  weeklyRateAbs: number;
  direction: "losing" | "gaining" | "stable";
  towardGoal: boolean;
  weeksToGoal: number | null;
  estimatedDate: string | null;
  series: WeightPoint[]; // cronológico
};

// logs do mais antigo para o mais recente
export function getWeightSeries(): WeightPoint[] {
  const logs = useProgressStore.getState().weightLogs;

  return [...logs]
    .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
    .map((log) => ({ weightKg: log.weightKg, loggedAt: log.loggedAt }));
}

function computeWeeklyRate(series: WeightPoint[]): number {
  if (series.length < 2) return 0;

  // usa a janela dos últimos 30 dias se houver pontos suficientes
  const limit = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = series.filter((point) => new Date(point.loggedAt).getTime() >= limit);
  const window = recent.length >= 2 ? recent : series;

  const first = window[0];
  const last = window[window.length - 1];

  const weeks = (new Date(last.loggedAt).getTime() - new Date(first.loggedAt).getTime()) / WEEK_MS;

  if (weeks <= 0.15) return 0;

  return (last.weightKg - first.weightKg) / weeks;
}

export function getProgressAnalytics(): ProgressAnalytics {
  const store = useProgressStore.getState();
  const objective = useProfileStore.getState().objective;

  const series = getWeightSeries();
  const startWeightKg = store.startWeightKg;
  const currentWeightKg = store.getCurrentWeight();
  const targetWeightKg = store.targetWeightKg;

  const weeklyRateKg = computeWeeklyRate(series);
  const weeklyRateAbs = Math.abs(weeklyRateKg);

  const direction: ProgressAnalytics["direction"] =
    weeklyRateKg < -0.05 ? "losing" : weeklyRateKg > 0.05 ? "gaining" : "stable";

  const needed = targetWeightKg - currentWeightKg; // negativo = precisa perder
  const remainingKg = Math.abs(needed);

  const towardGoal = (needed < 0 && weeklyRateKg < 0) || (needed > 0 && weeklyRateKg > 0);

  let weeksToGoal: number | null = null;
  let estimatedDate: string | null = null;

  if (towardGoal && weeklyRateAbs > 0.02 && remainingKg > 0.1) {
    weeksToGoal = Math.ceil(remainingKg / weeklyRateAbs);

    const date = new Date();
    date.setDate(date.getDate() + weeksToGoal * 7);
    estimatedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return {
    startWeightKg,
    currentWeightKg,
    targetWeightKg,
    objective,
    remainingKg,
    weeklyRateKg,
    weeklyRateAbs,
    direction,
    towardGoal,
    weeksToGoal,
    estimatedDate,
    series,
  };
}

const MEASUREMENT_FIELDS: { key: keyof BodyMeasurement; label: string }[] = [
  { key: "neckCm", label: "Pescoço" },
  { key: "chestCm", label: "Peito" },
  { key: "waistCm", label: "Cintura" },
  { key: "abdomenCm", label: "Abdômen" },
  { key: "hipCm", label: "Quadril" },
  { key: "armCm", label: "Braço" },
  { key: "thighCm", label: "Coxa" },
  { key: "calfCm", label: "Panturrilha" },
];

// compara a medida mais recente com a anterior
export function getMeasurementDeltas(): MeasurementDelta[] {
  const measurements = useProgressStore.getState().measurements;

  const sorted = [...measurements].sort(
    (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
  );

  const latest = sorted[0];
  const previous = sorted[1];

  if (!latest) return [];

  return MEASUREMENT_FIELDS.reduce<MeasurementDelta[]>((result, field) => {
    const current = latest[field.key] as number | undefined;
    if (typeof current !== "number") return result;

    const prev = previous?.[field.key] as number | undefined;
    const deltaCm = typeof prev === "number" ? Math.round((current - prev) * 10) / 10 : undefined;

    result.push({
      key: String(field.key),
      label: field.label,
      current,
      previous: prev,
      deltaCm,
    });

    return result;
  }, []);
}

export function getPhotoComparison() {
  const photos = useProgressStore.getState().photos;

  if (photos.length < 2) {
    return null;
  }

  const sorted = [...photos].sort(
    (a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime()
  );

  return {
    before: sorted[0],
    after: sorted[sorted.length - 1],
  };
}
