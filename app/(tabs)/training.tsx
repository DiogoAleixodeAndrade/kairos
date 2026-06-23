import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

export default function TrainingScreen() {
  const exercises = [
    "Supino reto",
    "Supino inclinado",
    "Desenvolvimento",
    "Elevação lateral",
    "Tríceps corda",
  ];

  return (
    <KairosScreen>
      <KairosHeader title="Treino" subtitle="Disciplina hoje. Domínio amanhã." />

      <KairosCard variant="purple" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.purple}>
          Treino de hoje
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 20 }}>
          Push Day
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 8 }}>
          Peito • Ombros • Tríceps
        </KairosText>
      </KairosCard>

      <View style={{ gap: 12, marginTop: 18 }}>
        {exercises.map((exercise) => (
          <KairosCard key={exercise} style={{ borderRadius: 18 }}>
            <KairosText variant="body" style={{ fontWeight: "800" }}>
              {exercise}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              4 séries • 8–10 reps
            </KairosText>
          </KairosCard>
        ))}
      </View>
    </KairosScreen>
  );
}