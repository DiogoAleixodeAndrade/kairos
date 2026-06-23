import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Text, TextInput, View } from "react-native";

export default function OnboardingStepOneScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0E1018", "#05050A"]} style={{ flex: 1, padding: 24 }}>
      <View style={{ marginTop: 80 }}>
        <Text style={{ color: "#D6A84F", fontSize: 14, fontWeight: "800", letterSpacing: 4 }}>
          ETAPA 1 DE 4
        </Text>

        <Text
          style={{
            color: "#F5F7FA",
            fontSize: 38,
            fontWeight: "800",
            lineHeight: 46,
            marginTop: 24,
          }}
        >
          Construa seu plano Kairos.
        </Text>

        <Text
          style={{
            color: "#A6A8B3",
            fontSize: 16,
            lineHeight: 24,
            marginTop: 12,
            marginBottom: 32,
          }}
        >
          Comece com seus dados básicos para a IA entender seu ponto de partida.
        </Text>

        <View style={{ gap: 14 }}>
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#6B7280"
            style={{
              backgroundColor: "#11131D",
              color: "#F5F7FA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
              fontSize: 16,
            }}
          />

          <TextInput
            placeholder="Idade"
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
            style={{
              backgroundColor: "#11131D",
              color: "#F5F7FA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
              fontSize: 16,
            }}
          />

          <TextInput
            placeholder="Peso atual em kg"
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
            style={{
              backgroundColor: "#11131D",
              color: "#F5F7FA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
              fontSize: 16,
            }}
          />

          <TextInput
            placeholder="Altura em cm"
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
            style={{
              backgroundColor: "#11131D",
              color: "#F5F7FA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
              fontSize: 16,
            }}
          />
        </View>

        <Link
          href="/(tabs)/home"
          style={{
            marginTop: 32,
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
          Gerar meu plano
        </Link>
      </View>
    </LinearGradient>
  );
}