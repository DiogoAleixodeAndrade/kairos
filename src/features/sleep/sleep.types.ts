export type SleepLog = {
  id: string;
  sleptAt: string;
  wokeUpAt: string;
  durationMinutes: number;
  qualityScore: number;
  energyScore: number;
  interruptions: number;
  notes?: string;
};

export type SleepSummary = {
  durationMinutes: number;
  durationText: string;
  qualityScore: number;
  energyScore: number;
  interruptions: number;
};

// ===== Etapa 30 — Análise de sono =====

export type SleepRange = "7d" | "30d";

export type SleepDayPoint = {
  label: string; // ex "Seg" ou "12/05"
  durationMinutes: number;
  qualityScore: number;
};

export type SleepAnalytics = {
  range: SleepRange;
  count: number;
  avgDurationMinutes: number;
  avgDurationText: string;
  avgQuality: number;
  avgEnergy: number;
  avgInterruptions: number;
  consistencyPct: number; // % de noites com 7h ou mais
  series: SleepDayPoint[]; // ordem cronológica para o gráfico
  insight: string;
};
