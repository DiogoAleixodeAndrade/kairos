import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { getWeeklyTrainingSummary } from "@/features/training/training-analytics.service";
import { useTrainingStore } from "@/stores/training.store";
import { colors, radius } from "@/styles/theme";
import { router } from "expo-router";
import { CheckCircle2, ChevronRight, Dumbbell } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getWeekDates() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export default function TrainingScreen() {
  const workouts = useTrainingStore((state) => state.workouts);
  const sessions = useTrainingStore((state) => state.sessions);
  const weeklyPlan = useTrainingStore((state) => state.weeklyPlan);
  const getWorkoutForWeekday = useTrainingStore((state) => state.getWorkoutForWeekday);

  const todayWeekday = new Date().getDay();
  const [selectedWeekday, setSelectedWeekday] = useState(todayWeekday);

  const weekDates = useMemo(() => getWeekDates(), []);

  const selectedWorkout = useMemo(() => {
    return getWorkoutForWeekday(selectedWeekday);
  }, [getWorkoutForWeekday, selectedWeekday, weeklyPlan, workouts]);

  const summary = useMemo(() => {
    return getWeeklyTrainingSummary();
  }, [sessions]);

  const isSelectedToday = selectedWeekday === todayWeekday;

  return (
    <KairosScreen>
      <KairosHeader title="Treino" subtitle="Disciplina hoje. Domínio amanhã." />

      {/* régua da semana */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
        style={{ marginTop: 24 }}
      >
        {weekDates.map((date, index) => {
          const isSelected = index === selectedWeekday;
          const isToday = index === todayWeekday;
          const hasPlan = Boolean(weeklyPlan[index]);

          return (
            <Pressable
              key={index}
              onPress={() => setSelectedWeekday(index)}
              style={{
                width: 54,
                paddingVertical: 12,
                borderRadius: radius.md,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isSelected ? colors.success : colors.border,
                backgroundColor: isSelected ? "rgba(34,197,94,0.12)" : colors.card,
              }}
            >
              <KairosText
                variant="subtitle"
                color={isToday ? colors.success : colors.muted}
                style={{ fontSize: 12 }}
              >
                {WEEKDAY_LABELS[index]}
              </KairosText>
              <KairosText
                variant="body"
                style={{ fontWeight: "900", marginTop: 4 }}
                color={isSelected ? colors.success : colors.white}
              >
                {date.getDate()}
              </KairosText>
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  marginTop: 6,
                  backgroundColor: hasPlan ? colors.purple : "transparent",
                }}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      {!selectedWorkout ? (
        <KairosCard style={{ marginTop: 20 }}>
          <KairosText variant="body" style={{ fontWeight: "900" }}>
            Dia de descanso.
          </KairosText>
          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Nenhum treino planejado para {WEEKDAY_LABELS[selectedWeekday]}. Recuperação
            também constrói resultado.
          </KairosText>
        </KairosCard>
      ) : (
        <>
          <KairosCard variant="purple" style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Dumbbell color={colors.purple} size={28} />

              <View style={{ flex: 1 }}>
                <KairosText variant="label" color={colors.purple}>
                  {isSelectedToday ? "Treino de hoje" : "Treino planejado"}
                </KairosText>

                <KairosText
                  variant="body"
                  style={{ fontSize: 30, fontWeight: "900", marginTop: 8 }}
                >
                  {selectedWorkout.title}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {selectedWorkout.subtitle}
                </KairosText>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              <View style={{ flex: 1 }}>
                <KairosText variant="subtitle">Duração</KairosText>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                  {selectedWorkout.durationMinutes} min
                </KairosText>
              </View>
              <View style={{ flex: 1 }}>
                <KairosText variant="subtitle">Estimativa</KairosText>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                  {selectedWorkout.estimatedCalories} kcal
                </KairosText>
              </View>
              <View style={{ flex: 1 }}>
                <KairosText variant="subtitle">Exercícios</KairosText>
                <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                  {selectedWorkout.exercises.length}
                </KairosText>
              </View>
            </View>

            {isSelectedToday ? (
              selectedWorkout.status === "completed" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 18,
                  }}
                >
                  <CheckCircle2 color={colors.success} size={20} />
                  <KairosText
                    variant="body"
                    color={colors.success}
                    style={{ fontWeight: "900" }}
                  >
                    Treino concluído
                  </KairosText>
                </View>
              ) : (
                <KairosButton
                  style={{ marginTop: 22 }}
                  onPress={() => router.push("/workout/log")}
                >
                  Iniciar treino
                </KairosButton>
              )
            ) : null}
          </KairosCard>

          <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
            Exercícios
          </KairosText>

          <View style={{ gap: 12, marginTop: 14 }}>
            {selectedWorkout.exercises.map((exercise) => (
              <KairosCard key={exercise.id} style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {exercise.name}
                    </KairosText>
                    <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                      {exercise.muscleGroup} • {exercise.targetSets} séries •{" "}
                      {exercise.targetReps} reps • {exercise.restSeconds}s
                    </KairosText>
                  </View>

                  {exercise.targetWeightKg ? (
                    <KairosText
                      variant="body"
                      color={colors.gold}
                      style={{ fontWeight: "900" }}
                    >
                      {exercise.targetWeightKg} kg
                    </KairosText>
                  ) : null}
                </View>
              </KairosCard>
            ))}
          </View>
        </>
      )}

      {/* resumo semanal */}
      <KairosCard variant="gold" style={{ marginTop: 24 }}>
        <KairosText variant="label" color={colors.gold}>
          Resumo da semana
        </KairosText>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <KairosText variant="metric">{summary.sessionsThisWeek}</KairosText>
            <KairosText variant="subtitle" style={{ marginTop: 2 }}>
              treinos
            </KairosText>
          </View>
          <View style={{ flex: 1 }}>
            <KairosText variant="metric">
              {(summary.totalVolumeKg / 1000).toFixed(1)}t
            </KairosText>
            <KairosText variant="subtitle" style={{ marginTop: 2 }}>
              volume
            </KairosText>
          </View>
          <View style={{ flex: 1 }}>
            <KairosText variant="metric">{summary.avgDurationMinutes}</KairosText>
            <KairosText variant="subtitle" style={{ marginTop: 2 }}>
              min médios
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <Pressable
        onPress={() => router.push("/workout/history")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 14,
          padding: 18,
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <KairosText variant="body" style={{ fontWeight: "900" }}>
          Ver histórico de treinos
        </KairosText>
        <ChevronRight color={colors.muted} size={20} />
      </Pressable>
    </KairosScreen>
  );
}