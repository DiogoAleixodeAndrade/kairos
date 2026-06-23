import { KairosAIInsightCard } from "@/components/cards/KairosAIInsightCard";
import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <KairosScreen>
      <KairosLogo />

      <KairosText variant="subtitle" style={{ marginTop: 32 }}>
        Bom dia,
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 4 }}>
        Diogo ✦
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 6 }}>
        Cada momento é uma oportunidade.
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Resumo do dia
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 20 }}>
          1.890
          <KairosText variant="body" color={colors.muted} style={{ fontSize: 22 }}>
            {" "}
            / 2.600 kcal
          </KairosText>
        </KairosText>

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8 }}>
          72% da meta
        </KairosText>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosStatCard
          label="Água"
          value="70%"
          description="2.1L / 3L"
          accent="blue"
          style={{ flex: 1 }}
        />

        <KairosStatCard
          label="Treino"
          value="Push"
          description="60 min • 480 kcal"
          accent="purple"
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ marginTop: 14 }}>
        <KairosAIInsightCard message="Sua consistência está subindo. Hoje o foco ideal é bater proteína, manter a água e dormir um pouco mais cedo." />
      </View>
    </KairosScreen>
  );
}