import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 32 }}>Bom dia,</Text>

        <Text style={{ color: "#F5F7FA", fontSize: 44, fontWeight: "800", marginTop: 4 }}>
          Diogo ✦
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 6 }}>
          Cada momento é uma oportunidade.
        </Text>

        <View
          style={{
            marginTop: 28,
            backgroundColor: "#11131D",
            borderRadius: 26,
            borderWidth: 1,
            borderColor: "rgba(214,168,79,0.28)",
            padding: 22,
          }}
        >
          <Text style={{ color: "#D6A84F", fontSize: 13, fontWeight: "800", letterSpacing: 2 }}>
            RESUMO DO DIA
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 20 }}>
            1.890
            <Text style={{ color: "#A6A8B3", fontSize: 22 }}> / 2.600 kcal</Text>
          </Text>

          <Text style={{ color: "#D6A84F", fontSize: 16, marginTop: 8 }}>72% da meta</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#11131D",
              borderRadius: 22,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
            }}
          >
            <Text style={{ color: "#4CC9F0", fontSize: 13, fontWeight: "800" }}>ÁGUA</Text>
            <Text style={{ color: "#F5F7FA", fontSize: 32, fontWeight: "800", marginTop: 12 }}>
              70%
            </Text>
            <Text style={{ color: "#A6A8B3", fontSize: 14 }}>2.1L / 3L</Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#11131D",
              borderRadius: 22,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
            }}
          >
            <Text style={{ color: "#7C5CFF", fontSize: 13, fontWeight: "800" }}>TREINO</Text>
            <Text style={{ color: "#F5F7FA", fontSize: 24, fontWeight: "800", marginTop: 12 }}>
              Push Day
            </Text>
            <Text style={{ color: "#A6A8B3", fontSize: 14 }}>60 min • 480 kcal</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: "#11131D",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(124,92,255,0.35)",
            padding: 20,
          }}
        >
          <Text style={{ color: "#7C5CFF", fontSize: 13, fontWeight: "800", letterSpacing: 2 }}>
            KAIROS AI
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 16, lineHeight: 24, marginTop: 12 }}>
            Sua consistência está subindo. Hoje o foco ideal é bater proteína, manter a água e
            dormir um pouco mais cedo.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}