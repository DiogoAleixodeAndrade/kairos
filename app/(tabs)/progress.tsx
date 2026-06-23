import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { colors } from "@/styles/theme";
import { View } from "react-native";

export default function ProgressScreen() {
  const onboarding = useOnboardingStore();

  const currentWeight = Number(onboarding.currentWeightKg || 145);
  const startWeight =
    onboarding.journeyMode === "with_history"
      ? Number(onboarding.journeyStartWeightKg || 185)
      : currentWeight;

  const targetWeight = Number(onboarding.targetWeightKg || 120);
  const lostWeight = startWeight > currentWeight ? startWeight - currentWeight : 0;
  const totalGoal = startWeight > targetWeight ? startWeight - targetWeight : 0;
  const progress = totalGoal > 0 ? Math.min(100, Math.round((lostWeight / totalGoal) * 100)) : 0;

  return (
    <KairosScreen>
      <KairosHeader title="Progresso" subtitle="Cada escolha te move para frente." />

      <KairosCard variant="gold" style={{ marginTop: 28, alignItems: "center" }}>
        <KairosText variant="label" color={colors.gold}>
          Peso atual
        </KairosText>

        <KairosText variant="metric" style={{ fontSize: 52, marginTop: 12 }}>
          {currentWeight.toFixed(1)} kg
        </KairosText>

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8 }}>
          {progress}% até a meta
        </KairosText>
      </KairosCard>

      {onboarding.journeyMode === "with_history" ? (
        <KairosCard variant="purple" style={{ marginTop: 14 }}>
          <KairosText variant="label" color={colors.purple}>
            Histórico da jornada
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            -{lostWeight.toFixed(1)} kg
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Você começou com {startWeight.toFixed(1)} kg e já completou {progress}% do caminho até {targetWeight.toFixed(1)} kg.
          </KairosText>
        </KairosCard>
      ) : null}

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosStatCard
          label="Treinos"
          value="5"
          description="Esta semana"
          accent="gold"
          style={{ flex: 1 }}
        />

        <KairosStatCard
          label="Streak"
          value="14"
          description="dias"
          accent="purple"
          style={{ flex: 1 }}
        />
      </View>
    </KairosScreen>
  );
}