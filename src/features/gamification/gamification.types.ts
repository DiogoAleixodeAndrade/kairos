export type GamificationAction =
  | "meal_logged"
  | "water_logged"
  | "workout_completed"
  | "sleep_logged"
  | "weight_logged"
  | "measurement_logged"
  | "photo_logged"
  | "ai_report_generated";

export type AchievementId =
  | "first_meal"
  | "first_water"
  | "first_workout"
  | "first_sleep"
  | "first_weight"
  | "first_measurement"
  | "first_photo"
  | "first_ai_report";

export type AchievementCategory = "nutrition" | "training" | "sleep" | "progress" | "ai";

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  xpReward: number;
};

export type UserAchievement = AchievementDefinition & {
  unlockedAt: string;
};

export type XPLog = {
  id: string;
  amount: number;
  reason: string;
  action: GamificationAction;
  createdAt: string;
};

export type LevelInfo = {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercentage: number;
};