import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { colors } from "@/styles/theme";
import { CalendarClock, History } from "lucide-react-native";
import { router } from "expo-router";
import { View } from "react-native";

export default function JourneyScreen() {
  const { journeyMode, setJourneyMode } = useOnboardingStore();

  return (
    <KairosScreen>
      <KairosLogo />

      <KairosText variant="label" style={{ marginTop: 32 }}>
        Etapa 1 de 4
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Sua jornada começou agora ou antes?
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        O Kairos pode considerar hoje como seu ponto de partida ou registrar sua evolução desde o início.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <KairosOptionCard
          title="Começar do zero"
          description="Vou considerar hoje como o primeiro dia da sua evolução no Kairos."
          selected={journeyMode === "from_scratch"}
          onPress={() => setJourneyMode("from_scratch")}
          icon={<CalendarClock color={colors.gold} size={28} />}
        />

        <KairosOptionCard
          title="Registrar meu histórico"
          description="Informe quando sua jornada começou e qual era seu peso inicial."
          selected={journeyMode === "with_history"}
          onPress={() => setJourneyMode("with_history")}
          icon={<History color={colors.purple} size={28} />}
        />
      </View>

      <KairosButton
        style={{ marginTop: 28 }}
        onPress={() => router.push("/(onboarding)/step-one")}
      >
        Continuar
      </KairosButton>
    </KairosScreen>
  );
}