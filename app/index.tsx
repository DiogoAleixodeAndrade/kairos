import { KairosButton } from "@/components/ui/KairosButton";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function IndexScreen() {
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSoft, colors.background]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <KairosLogo size="lg" />

      <KairosText variant="title" style={{ marginTop: 24, textAlign: "center" }}>
        O tempo certo para evoluir.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 12, textAlign: "center" }}>
        Seu sistema inteligente de alimentação, treino, sono e evolução com IA.
      </KairosText>

      <KairosButton
        style={{ marginTop: 40, alignSelf: "stretch" }}
        onPress={() => router.push("/(auth)/welcome")}
      >
        Começar agora
      </KairosButton>
    </LinearGradient>
  );
}