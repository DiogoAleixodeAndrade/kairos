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