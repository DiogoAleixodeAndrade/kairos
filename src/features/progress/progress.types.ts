export type WeightLog = {
  id: string;
  weightKg: number;
  loggedAt: string;
  notes?: string;
};

export type BodyMeasurement = {
  id: string;
  measuredAt: string;
  neckCm?: number;
  chestCm?: number;
  waistCm?: number;
  abdomenCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  calfCm?: number;
  notes?: string;
};

export type ProgressPhotoType = "front" | "side" | "back" | "free";

export type ProgressPhoto = {
  id: string;
  uri: string;
  type: ProgressPhotoType;
  takenAt: string;
  notes?: string;
};

export type ProgressSummary = {
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  lostWeightKg: number;
  remainingWeightKg: number;
  progressPercentage: number;
  latestWaistCm?: number;
  latestPhotoUri?: string;
};