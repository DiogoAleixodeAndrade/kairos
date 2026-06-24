import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useTrainingStore } from "@/stores/training.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { CheckCircle2, Dumbbell } from "lucide-react-native";
import { View } from "react-native";

export default function TrainingScreen() {
  const todayWorkout = useTrainingStore((state) => state.getTodayWorkout());
  const completedThisWeek = useTrainingStore((state) => state.getCompletedWorkoutsThisWeek());

  return (
    <KairosScreen>
      <KairosHeader title="Treino" subtitle="Disciplina hoje. Domínio amanhã." />

      {!todayWorkout ? (
        <KairosCard style={{ marginTop: 28 }}>
          <KairosText variant="body" style={{ fontWeight: "900" }}>
            Nenhum treino planejado para hoje.
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Em breve a Kairos AI vai gerar sua divisão semanal personalizada.
          </KairosText>
        </KairosCard>
      ) : (
        <>
          <KairosCard variant="purple" style={{ marginTop: 28 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Dumbbell color={colors.purple} size={28} />

              <View style={{ flex: 1 }}>
                <KairosText variant="label" color={colors.purple}>
                  Treino de hoje
                </KairosText>

                <KairosText variant="body" style={{ fontSize: 30, fontWeight: "900", marginTop: 8 }}>
                  {todayWorkout.title}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {todayWorkout.subtitle}
                </KairosText>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              <View style={{ flex: 1 }}>
                <KairosText variant="subtitle">Duração</KairosText>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                  {todayWorkout.durationMinutes} min
                </KairosText>
              </View>

              <View style={{ flex: 1 }}>
                <KairosText variant="subtitle">Estimativa</KairosText>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                  {todayWorkout.estimatedCalories} kcal
                </KairosText>
              </View>
            </View>

            {todayWorkout.status === "completed" ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 }}>
                <CheckCircle2 color={colors.success} size={20} />
                <KairosText variant="body" color={colors.success} style={{ fontWeight: "900" }}>
                  Treino concluído
                </KairosText>
              </View>
            ) : (
              <KairosButton style={{ marginTop: 22 }} onPress={() => router.push("/workout/log")}>
                Iniciar treino
              </KairosButton>
            )}
          </KairosCard>

          <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
            Exercícios
          </KairosText>

          <View style={{ gap: 12, marginTop: 14 }}>
            {todayWorkout.exercises.map((exercise) => (
              <KairosCard key={exercise.id} style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {exercise.name}
                    </KairosText>

                    <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                      {exercise.muscleGroup} • {exercise.targetSets} séries • {exercise.targetReps} reps
                    </KairosText>
                  </View>

                  {exercise.targetWeightKg ? (
                    <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                      {exercise.targetWeightKg} kg
                    </KairosText>
                  ) : null}
                </View>
              </KairosCard>
            ))}
          </View>
        </>
      )}

      <KairosCard variant="gold" style={{ marginTop: 18 }}>
        <KairosText variant="label" color={colors.gold}>
          Semana atual
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 12 }}>
          {completedThisWeek}
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4 }}>
          treinos concluídos nesta semana.
        </KairosText>
      </KairosCard>
    </KairosScreen>
  );
}