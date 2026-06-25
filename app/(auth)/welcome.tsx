import { KairosButton } from "@/components/ui/KairosButton";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { View } from "react-native";
import { useProfileStore } from "@/stores/profile.store";

export default function WelcomeScreen() {
  const setDemoMode = useProfileStore((state) => state.setDemoMode);

  return (
    <LinearGradient
      colors={[colors.background, "#10111A", colors.background]}
      style={{ flex: 1, padding: 24, justifyContent: "flex-end" }}
    >
      <View style={{ marginBottom: 64 }}>
        <KairosLogo size="lg" />

        <KairosText
          variant="title"
          style={{ fontSize: 44, lineHeight: 52, marginTop: 32 }}
        >
          Evolua no tempo certo.
        </KairosText>

        <KairosText
          variant="subtitle"
          style={{ fontSize: 17, lineHeight: 26, marginTop: 16 }}
        >
          Alimentação, treino, sono, progresso e IA trabalhando juntos para sua
          melhor versão.
        </KairosText>

        <KairosButton
          style={{ marginTop: 36 }}
          onPress={() => router.push("/(auth)/register")}
        >
          Criar minha conta
        </KairosButton>

        <KairosButton
          variant="secondary"
          style={{ marginTop: 14 }}
          onPress={() => router.push("/(auth)/login")}
        >
          Já tenho conta
        </KairosButton>

        <KairosButton
          variant="ghost"
          style={{ marginTop: 6 }}
          onPress={() => {
            setDemoMode(true);
            router.push("/(onboarding)/journey");
          }}
        >
          Entrar no app demo
        </KairosButton>
      </View>
    </LinearGradient>
  );
}
