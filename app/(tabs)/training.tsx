import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export default function TrainingScreen() {
  return (
    <LinearGradient colors={["#05050A", "#0B0D14", "#05050A"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        <Text style={{ color: "#D6A84F", fontSize: 20, fontWeight: "800", letterSpacing: 5 }}>
          KAIROS
        </Text>

        <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 32 }}>
          Treino
        </Text>

        <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 8 }}>
          Disciplina hoje. Domínio amanhã.
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
          <Text style={{ color: "#7C5CFF", fontSize: 13, fontWeight: "800", letterSpacing: 2 }}>
            TREINO DE HOJE
          </Text>

          <Text style={{ color: "#F5F7FA", fontSize: 42, fontWeight: "800", marginTop: 20 }}>
            Push Day
          </Text>

          <Text style={{ color: "#A6A8B3", fontSize: 16, marginTop: 8 }}>
            Peito • Ombros • Tríceps
          </Text>
        </View>

        {["Supino reto", "Supino inclinado", "Desenvolvimento", "Elevação lateral", "Tríceps corda"].map(
          (exercise) => (
            <View
              key={exercise}
              style={{
                marginTop: 12,
                backgroundColor: "#11131D",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                padding: 18,
              }}
            >
              <Text style={{ color: "#F5F7FA", fontSize: 16, fontWeight: "700" }}>{exercise}</Text>
              <Text style={{ color: "#A6A8B3", fontSize: 14, marginTop: 4 }}>4 séries • 8–10 reps</Text>
            </View>
          )
        )}
      </ScrollView>
    </LinearGradient>
  );
}