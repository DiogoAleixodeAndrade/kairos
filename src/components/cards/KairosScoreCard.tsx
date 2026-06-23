import { KairosCard } from "@/components/ui/KairosCard";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

type KairosScoreCardProps = {
  score: number;
};

export function KairosScoreCard({ score }: KairosScoreCardProps) {
  let message = "Construindo consistência.";

  if (score >= 90) {
    message = "Excelente consistência.";
  } else if (score >= 75) {
    message = "Boa evolução hoje.";
  } else if (score >= 50) {
    message = "Dia mediano. Ainda dá para ajustar.";
  } else {
    message = "Hoje precisa de atenção.";
  }

  return (
    <KairosCard variant="purple">
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <KairosText variant="label" color={colors.purple}>
            Score Kairos
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 8 }}>
            {message}
          </KairosText>
        </View>

        <View
          style={{
            width: 86,
            height: 86,
            borderRadius: 999,
            borderWidth: 8,
            borderColor: "rgba(124,92,255,0.25)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KairosText variant="body" style={{ fontSize: 24, fontWeight: "900" }}>
            {score}
          </KairosText>
        </View>
      </View>

      <KairosProgressBar value={score} max={100} color={colors.purple} style={{ marginTop: 18 }} />
    </KairosCard>
  );
}