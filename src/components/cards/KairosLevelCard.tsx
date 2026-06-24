import { KairosCard } from "@/components/ui/KairosCard";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

type KairosLevelCardProps = {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercentage: number;
};

export function KairosLevelCard({
  level,
  totalXp,
  currentLevelXp,
  xpForNextLevel,
  progressPercentage,
}: KairosLevelCardProps) {
  return (
    <KairosCard variant="gold">
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <KairosText variant="label" color={colors.gold}>
            Nível Kairos
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            Nv. {level}
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            {totalXp} XP acumulados
          </KairosText>
        </View>

        <View
          style={{
            width: 82,
            height: 82,
            borderRadius: 999,
            borderWidth: 8,
            borderColor: "rgba(214,168,79,0.24)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KairosText variant="body" color={colors.gold} style={{ fontSize: 22, fontWeight: "900" }}>
            {progressPercentage}%
          </KairosText>
        </View>
      </View>

      <KairosProgressBar
        value={currentLevelXp}
        max={xpForNextLevel}
        color={colors.gold}
        style={{ marginTop: 18 }}
      />

      <KairosText variant="body" color={colors.gold} style={{ marginTop: 8, fontWeight: "900" }}>
        {currentLevelXp} / {xpForNextLevel} XP para o próximo nível
      </KairosText>
    </KairosCard>
  );
}