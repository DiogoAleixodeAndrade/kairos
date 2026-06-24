import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ACHIEVEMENTS,
  ACTION_ACHIEVEMENTS,
  ACTION_LABELS,
  XP_BY_ACTION,
  getAchievementById,
  getLevelInfo,
} from "@/features/gamification/gamification.config";
import type {
  AchievementDefinition,
  GamificationAction,
  LevelInfo,
  UserAchievement,
  XPLog,
} from "@/features/gamification/gamification.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type GamificationState = {
  totalXp: number;
  xpLogs: XPLog[];
  unlockedAchievements: UserAchievement[];

  awardAction: (action: GamificationAction) => void;
  getLevelInfo: () => LevelInfo;
  getUnlockedAchievements: () => UserAchievement[];
  getLockedAchievements: () => AchievementDefinition[];
  getRecentXPLogs: () => XPLog[];
  resetGamification: () => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      totalXp: 0,
      xpLogs: [],
      unlockedAchievements: [],

      awardAction: (action) => {
        const baseXp = XP_BY_ACTION[action];
        const actionLabel = ACTION_LABELS[action];
        const achievementIds = ACTION_ACHIEVEMENTS[action];
        const now = new Date().toISOString();

        set((state) => {
          const alreadyUnlockedIds = new Set(
            state.unlockedAchievements.map((achievement) => achievement.id)
          );

          const newAchievements = achievementIds
            .filter((achievementId) => !alreadyUnlockedIds.has(achievementId))
            .map((achievementId) => getAchievementById(achievementId))
            .filter(Boolean) as AchievementDefinition[];

          const achievementXp = newAchievements.reduce(
            (total, achievement) => total + achievement.xpReward,
            0
          );

          const totalGain = baseXp + achievementXp;

          const xpLog: XPLog = {
            id: createId(),
            amount: totalGain,
            reason:
              achievementXp > 0
                ? `${actionLabel} + conquista desbloqueada`
                : actionLabel,
            action,
            createdAt: now,
          };

          const unlockedAchievements: UserAchievement[] = newAchievements.map((achievement) => ({
            ...achievement,
            unlockedAt: now,
          }));

          return {
            totalXp: state.totalXp + totalGain,
            xpLogs: [xpLog, ...state.xpLogs],
            unlockedAchievements: [...unlockedAchievements, ...state.unlockedAchievements],
          };
        });
      },

      getLevelInfo: () => {
        return getLevelInfo(get().totalXp);
      },

      getUnlockedAchievements: () => {
        return get().unlockedAchievements;
      },

      getLockedAchievements: () => {
        const unlockedIds = new Set(get().unlockedAchievements.map((achievement) => achievement.id));

        return ACHIEVEMENTS.filter((achievement) => !unlockedIds.has(achievement.id));
      },

      getRecentXPLogs: () => {
        return get().xpLogs.slice(0, 8);
      },

      resetGamification: () =>
        set({
          totalXp: 0,
          xpLogs: [],
          unlockedAchievements: [],
        }),
    }),
    {
      name: "kairos-gamification-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);