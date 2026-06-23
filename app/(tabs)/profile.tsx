import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 32 }}>
          Diogo ✦
        </Text>

        <Text style={{ color: "#D6A84F", fontSize: 16, marginTop: 6 }}>Level 1 • Kairos Disciple</Text>

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
          <Text style={{ color: "#F5F7FA", fontSize: 24, fontWeight: "800" }}>Objetivo atual</Text>
          <Text style={{ color: "#A6A8B3", fontSize: 16, lineHeight: 24, marginTop: 8 }}>
            Perder gordura, melhorar condicionamento e construir consistência.
          </Text>
        </View>

        {["Configurações", "Notificações", "Plano Premium", "Aparência", "Privacidade"].map((item) => (
          <View
            key={item}
            style={{
              marginTop: 12,
              backgroundColor: "#11131D",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
            }}
          >
            <Text style={{ color: "#F5F7FA", fontSize: 16, fontWeight: "700" }}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}