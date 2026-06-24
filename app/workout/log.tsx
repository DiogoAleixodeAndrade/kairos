import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import type { WorkoutSetLog } from "@/features/training/training.types";
import { useTrainingStore } from "@/stores/training.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

export default function WorkoutLogScreen() {
  const todayWorkout = useTrainingStore((state) => state.getTodayWorkout());
  const addSession = useTrainingStore((state) => state.addSession);
  const completeTodayWorkout = useTrainingStore((state) => state.completeTodayWorkout);

  const awardAction = useGamificationStore((state) => state.awardAction);

  const [durationMinutes, setDurationMinutes] = useState(
    todayWorkout?.durationMinutes ? String(todayWorkout.durationMinutes) : "60"
  );

  const [estimatedCalories, setEstimatedCalories] = useState(
    todayWorkout?.estimatedCalories ? String(todayWorkout.estimatedCalories) : "450"
  );

  const setLogs = useMemo<WorkoutSetLog[]>(() => {
    if (!todayWorkout) return [];

    return todayWorkout.exercises.flatMap((exercise) =>
      Array.from({ length: exercise.targetSets }).map((_, index) => ({
        id: createId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: index + 1,
        reps: 0,
        weightKg: exercise.targetWeightKg ?? 0,
        completed: false,
      }))
    );
  }, [todayWorkout]);

  function finishWorkout() {
    if (!todayWorkout) {
      Alert.alert("Sem treino", "Não existe treino planejado para hoje.");
      return;
    }

    const duration = toNumber(durationMinutes);
    const calories = toNumber(estimatedCalories);

    if (duration <= 0) {
      Alert.alert("Duração inválida", "Digite a duração do treino.");
      return;
    }

    addSession({
      workoutId: todayWorkout.id,
      title: todayWorkout.title,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationMinutes: duration,
      estimatedCalories: calories,
      setLogs,
    });

    completeTodayWorkout();

    awardAction("workout_completed");

    Alert.alert("Treino concluído", "Seu treino foi registrado com sucesso.");
    router.back();
  }

  if (!todayWorkout) {
    return (
      <KairosScreen>
        <KairosText variant="title">Sem treino</KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 10 }}>
          Nenhum treino foi encontrado para hoje.
        </KairosText>

        <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
          Voltar
        </KairosButton>
      </KairosScreen>
    );
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.purple}>
        Registro de treino
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        {todayWorkout.title}
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Confirme as informações do treino para registrar sua evolução de hoje.
      </KairosText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 28 }}>
        <KairosInput
          label="Duração"
          placeholder="60"
          keyboardType="numeric"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
        />

        <KairosInput
          label="Calorias"
          placeholder="480"
          keyboardType="numeric"
          value={estimatedCalories}
          onChangeText={setEstimatedCalories}
        />
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Exercícios realizados
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {todayWorkout.exercises.map((exercise) => (
          <KairosCard key={exercise.id} style={{ borderRadius: 18 }}>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {exercise.name}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              {exercise.targetSets} séries • {exercise.targetReps} reps • descanso {exercise.restSeconds}s
            </KairosText>

            {exercise.targetWeightKg ? (
              <KairosText variant="body" color={colors.gold} style={{ marginTop: 8, fontWeight: "900" }}>
                Carga alvo: {exercise.targetWeightKg} kg
              </KairosText>
            ) : null}
          </KairosCard>
        ))}
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={finishWorkout}>
        Finalizar treino
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}