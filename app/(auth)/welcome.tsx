import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#05050A", "#10111A", "#05050A"]}
      style={{ flex: 1, padding: 24, justifyContent: "flex-end" }}
    >
      <View style={{ marginBottom: 64 }}>
        <Text style={{ color: "#D6A84F", fontSize: 22, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text
          style={{
            color: "#F5F7FA",
            fontSize: 44,
            fontWeight: "800",
            lineHeight: 52,
            marginTop: 32,
          }}
        >
          Evolua no tempo certo.
        </Text>

        <Text
          style={{
            color: "#A6A8B3",
            fontSize: 17,
            lineHeight: 26,
            marginTop: 16,
          }}
        >
          Alimentação, treino, sono, progresso e IA trabalhando juntos para sua melhor versão.
        </Text>

        <Link
          href="/(onboarding)/step-one"
          style={{
            marginTop: 36,
            backgroundColor: "#D6A84F",
            color: "#05050A",
            fontSize: 16,
            fontWeight: "800",
            paddingVertical: 18,
            textAlign: "center",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          Criar meu plano
        </Link>

        <Link
          href="/(tabs)/home"
          style={{
            marginTop: 16,
            color: "#F5F7FA",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Entrar no app demo
        </Link>
      </View>
    </LinearGradient>
  );
}