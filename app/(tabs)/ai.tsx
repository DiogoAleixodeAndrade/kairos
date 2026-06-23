import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function AIScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 32 }}>
          Kairos AI
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 8 }}>
          Seu guia pessoal de performance.
        </Text>

        <View
          style={{
            marginTop: 28,
            backgroundColor: "#11131D",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(124,92,255,0.45)",
            padding: 20,
          }}
        >
          <Text style={{ color: "#7C5CFF", fontSize: 20, fontWeight: "800" }}>
            Eu sou a Kairos AI.
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 16, lineHeight: 24, marginTop: 12 }}>
            Eu analiso sua alimentação, treino, sono, água e progresso para entregar decisões
            simples e inteligentes todos os dias.
          </Text>
        </View>

        <View
          style={{
            marginTop: 28,
            backgroundColor: "#11131D",
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text style={{ color: "#F5F7FA", fontSize: 16, lineHeight: 24 }}>
            Sua proteína ficou abaixo da meta nos últimos 3 dias. A melhor ação hoje é adicionar
            uma fonte proteica no café da manhã.
          </Text>
        </View>

        <TextInput
          placeholder="Pergunte qualquer coisa para a Kairos AI..."
          placeholderTextColor="#6B7280"
          style={{
            marginTop: 24,
            backgroundColor: "#11131D",
            color: "#F5F7FA",
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "rgba(124,92,255,0.45)",
            paddingVertical: 18,
            paddingHorizontal: 22,
            fontSize: 15,
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
}