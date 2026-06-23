import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export default function ProgressScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 32 }}>
          Progresso
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 8 }}>
          Cada escolha te move para frente.
        </Text>

        <View
          style={{
            marginTop: 28,
            backgroundColor: "#11131D",
            borderRadius: 26,
            borderWidth: 1,
            borderColor: "rgba(214,168,79,0.28)",
            padding: 22,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#A6A8B3", fontSize: 13, fontWeight: "800", letterSpacing: 2 }}>
            PESO ATUAL
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 52, fontWeight: "800", marginTop: 12 }}>
            74.3 kg
          </Text>

          <Text style={{ color: "#D6A84F", fontSize: 16, marginTop: 8 }}>72% até a meta</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#11131D",
              borderRadius: 22,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text style={{ color: "#D6A84F", fontSize: 13, fontWeight: "800" }}>TREINOS</Text>
            <Text style={{ color: "#F5F7FA", fontSize: 34, fontWeight: "800", marginTop: 12 }}>5</Text>
            <Text style={{ color: "#A6A8B3", fontSize: 14 }}>Esta semana</Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#11131D",
              borderRadius: 22,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text style={{ color: "#7C5CFF", fontSize: 13, fontWeight: "800" }}>STREAK</Text>
            <Text style={{ color: "#F5F7FA", fontSize: 34, fontWeight: "800", marginTop: 12 }}>14</Text>
            <Text style={{ color: "#A6A8B3", fontSize: 14 }}>dias</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}