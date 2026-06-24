import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { ActivityIndicator, View } from "react-native";

export function KairosLoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <KairosLogo size="lg" />

      <KairosText variant="title" style={{ marginTop: 28, textAlign: "center" }}>
        Kairos
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 8, textAlign: "center" }}>
        Preparando seu ambiente de evolução.
      </KairosText>

      <ActivityIndicator color={colors.gold} style={{ marginTop: 32 }} />
    </View>
  );
}