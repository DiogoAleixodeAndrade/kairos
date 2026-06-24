import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import type {
  AchievementDefinition,
  UserAchievement,
} from "@/features/gamification/gamification.types";
import { colors } from "@/styles/theme";
import { View } from "react-native";

type KairosAchievementCardProps = {
  achievement: AchievementDefinition | UserAchievement;
  locked?: boolean;
};

function formatDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("pt-BR");
}

export function KairosAchievementCard({ achievement, locked = false }: KairosAchievementCardProps) {
  const unlockedAt = "unlockedAt" in achievement ? achievement.unlockedAt : undefined;

  return (
    <KairosCard
      variant={locked ? "default" : "purple"}
      style={{
        borderRadius: 18,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            backgroundColor: locked ? "rgba(255,255,255,0.06)" : "rgba(124,92,255,0.22)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KairosText variant="body" style={{ fontSize: 20 }}>
            {locked ? "○" : "✦"}
          </KairosText>
        </View>

        <View style={{ flex: 1 }}>
          <KairosText variant="body" style={{ fontWeight: "900" }}>
            {achievement.title}
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            {achievement.description}
          </KairosText>

          <KairosText
            variant="body"
            color={locked ? colors.muted : colors.purple}
            style={{ marginTop: 8, fontWeight: "900" }}
          >
            {locked ? "Bloqueada" : `+${achievement.xpReward} XP`}
            {unlockedAt ? ` • ${formatDate(unlockedAt)}` : ""}
          </KairosText>
        </View>
      </View>
    </KairosCard>
  );
}