import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function IndexScreen() {
  return (
    <LinearGradient
      colors={["#05050A", "#0E1018", "#05050A"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <StatusBar style="light" />

      <Text style={{ color: "#D6A84F", fontSize: 42, fontWeight: "800", letterSpacing: 6 }}>
        KAIROS
      </Text>

      <Text
        style={{
          color: "#F5F7FA",
          fontSize: 28,
          fontWeight: "700",
          marginTop: 24,
          textAlign: "center",
        }}
      >
        O tempo certo para evoluir.
      </Text>

      <Text
        style={{
          color: "#A6A8B3",
          fontSize: 16,
          lineHeight: 24,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        Seu sistema inteligente de alimentação, treino, sono e evolução com IA.
      </Text>

      <Link
        href="/(auth)/welcome"
        style={{
          marginTop: 40,
          backgroundColor: "#D6A84F",
          color: "#05050A",
          fontSize: 16,
          fontWeight: "700",
          paddingVertical: 16,
          paddingHorizontal: 28,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        Começar agora
      </Link>
    </LinearGradient>
  );
}