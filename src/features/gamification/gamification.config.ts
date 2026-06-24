import type {
  AchievementDefinition,
  AchievementId,
  GamificationAction,
  LevelInfo,
} from "@/features/gamification/gamification.types";

export const XP_BY_ACTION: Record<GamificationAction, number> = {
  meal_logged: 25,
  water_logged: 5,
  workout_completed: 80,
  sleep_logged: 40,
  weight_logged: 20,
  measurement_logged: 25,
  photo_logged: 25,
  ai_report_generated: 30,
};

export const ACTION_LABELS: Record<GamificationAction, string> = {
  meal_logged: "Refeição registrada",
  water_logged: "Água adicionada",
  workout_completed: "Treino concluído",
  sleep_logged: "Sono registrado",
  weight_logged: "Peso atualizado",
  measurement_logged: "Medidas registradas",
  photo_logged: "Foto de evolução adicionada",
  ai_report_generated: "Relatório da IA gerado",
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_meal",
    title: "Primeira refeição",
    description: "Registrou sua primeira refeição no Kairos.",
    category: "nutrition",
    xpReward: 50,
  },
  {
    id: "first_water",
    title: "Primeiro copo",
    description: "Começou a registrar sua hidratação.",
    category: "nutrition",
    xpReward: 30,
  },
  {
    id: "first_workout",
    title: "Disciplina iniciada",
    description: "Concluiu seu primeiro treino.",
    category: "training",
    xpReward: 80,
  },
  {
    id: "first_sleep",
    title: "Recuperação monitorada",
    description: "Registrou sua primeira noite de sono.",
    category: "sleep",
    xpReward: 60,
  },
  {
    id: "first_weight",
    title: "Peso sob controle",
    description: "Atualizou seu peso pela primeira vez.",
    category: "progress",
    xpReward: 40,
  },
  {
    id: "first_measurement",
    title: "Além da balança",
    description: "Registrou suas primeiras medidas corporais.",
    category: "progress",
    xpReward: 50,
  },
  {
    id: "first_photo",
    title: "Evolução visível",
    description: "Adicionou sua primeira foto de evolução.",
    category: "progress",
    xpReward: 50,
  },
  {
    id: "first_ai_report",
    title: "Análise Kairos",
    description: "Gerou seu primeiro relatório diário com IA.",
    category: "ai",
    xpReward: 70,
  },
];

export const ACTION_ACHIEVEMENTS: Record<GamificationAction, AchievementId[]> = {
  meal_logged: ["first_meal"],
  water_logged: ["first_water"],
  workout_completed: ["first_workout"],
  sleep_logged: ["first_sleep"],
  weight_logged: ["first_weight"],
  measurement_logged: ["first_measurement"],
  photo_logged: ["first_photo"],
  ai_report_generated: ["first_ai_report"],
};

export const LEVEL_STEP_XP = 500;

export function getLevelInfo(totalXp: number): LevelInfo {
  const level = Math.floor(totalXp / LEVEL_STEP_XP) + 1;
  const currentLevelXp = totalXp % LEVEL_STEP_XP;
  const xpForNextLevel = LEVEL_STEP_XP;
  const progressPercentage = Math.round((currentLevelXp / xpForNextLevel) * 100);

  return {
    level,
    totalXp,
    currentLevelXp,
    xpForNextLevel,
    progressPercentage,
  };
}

export function getAchievementById(id: AchievementId) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}