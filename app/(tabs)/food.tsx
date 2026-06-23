import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export default function FoodScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 32 }}>
          Alimentação
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 8 }}>
          Abasteça seu corpo. Eleve seu potencial.
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
            CALORIAS
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 20 }}>
            1.890
            <Text style={{ color: "#A6A8B3", fontSize: 22 }}> / 2.600</Text>
          </Text>

          <Text style={{ color: "#D6A84F", fontSize: 16, marginTop: 8 }}>72% da meta</Text>
        </View>

        {["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia"].map((meal, index) => (
          <View
            key={meal}
            style={{
              marginTop: 12,
              backgroundColor: "#11131D",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              padding: 18,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#F5F7FA", fontSize: 16, fontWeight: "700" }}>{meal}</Text>
            <Text style={{ color: "#A6A8B3", fontSize: 15 }}>{[430, 620, 210, 510, 120][index]} kcal</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}