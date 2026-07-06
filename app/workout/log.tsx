import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import type { WorkoutSetLog } from "@/features/training/training.types";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useGamificationStore } from "@/stores/gamification.store";
import { useTrainingStore } from "@/stores/training.store";
import { colors, radius } from "@/styles/theme";
import { router } from "expo-router";
import { Check, Plus, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

// pega o primeiro número de algo como "8–10" -> 8
function parseFirstRep(targetReps: string) {
  const match = targetReps.match(/\d+/);
  return match ? Number(match[0]) : 0;
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

  const initialLogs = useMemo<WorkoutSetLog[]>(() => {
    if (!todayWorkout) return [];

    return todayWorkout.exercises.flatMap((exercise) =>
      Array.from({ length: exercise.targetSets }).map((_, index) => ({
        id: createId(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: index + 1,
        reps: parseFirstRep(exercise.targetReps),
        weightKg: exercise.targetWeightKg ?? 0,
        completed: false,
      }))
    );
  }, [todayWorkout]);

  const [logs, setLogs] = useState<WorkoutSetLog[]>(initialLogs);

  const [newExerciseName, setNewExerciseName] = useState("");

  // agrupa logs por exercício preservando a ordem de aparição
  const grouped = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, { name: string; sets: WorkoutSetLog[] }>();

    for (const log of logs) {
      if (!map.has(log.exerciseId)) {
        map.set(log.exerciseId, { name: log.exerciseName, sets: [] });
        order.push(log.exerciseId);
      }
      map.get(log.exerciseId)!.sets.push(log);
    }

    return order.map((exerciseId) => ({
      exerciseId,
      name: map.get(exerciseId)!.name,
      sets: map.get(exerciseId)!.sets,
    }));
  }, [logs]);

  function updateSet(setId: string, patch: Partial<WorkoutSetLog>) {
    setLogs((current) => current.map((log) => (log.id === setId ? { ...log, ...patch } : log)));
  }

  function toggleSet(setId: string) {
    setLogs((current) =>
      current.map((log) => (log.id === setId ? { ...log, completed: !log.completed } : log))
    );
  }

  function addSet(exerciseId: string, exerciseName: string) {
    setLogs((current) => {
      const existing = current.filter((log) => log.exerciseId === exerciseId);
      const lastSet = existing[existing.length - 1];

      const newSet: WorkoutSetLog = {
        id: createId(),
        exerciseId,
        exerciseName,
        setNumber: existing.length + 1,
        reps: lastSet?.reps ?? 0,
        weightKg: lastSet?.weightKg ?? 0,
        completed: false,
      };

      return [...current, newSet];
    });
  }

  function removeSet(setId: string) {
    setLogs((current) => {
      const target = current.find((log) => log.id === setId);
      if (!target) return current;

      const filtered = current.filter((log) => log.id !== setId);

      // renumera as séries daquele exercício
      let counter = 0;
      return filtered.map((log) => {
        if (log.exerciseId !== target.exerciseId) return log;
        counter += 1;
        return { ...log, setNumber: counter };
      });
    });
  }

  function addExercise() {
    const name = newExerciseName.trim();
    if (!name) return;

    const exerciseId = createId();

    setLogs((current) => [
      ...current,
      {
        id: createId(),
        exerciseId,
        exerciseName: name,
        setNumber: 1,
        reps: 0,
        weightKg: 0,
        completed: false,
      },
    ]);
    setNewExerciseName("");
  }

  const completedCount = logs.filter((log) => log.completed).length;
  const totalVolume = logs.reduce(
    (total, log) => (log.completed ? total + log.reps * log.weightKg : total),
    0
  );

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

    if (completedCount === 0) {
      Alert.alert(
        "Nenhuma série concluída",
        "Marque pelo menos uma série como concluída antes de finalizar."
      );
      return;
    }

    addSession({
      workoutId: todayWorkout.id,
      title: todayWorkout.title,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      durationMinutes: duration,
      estimatedCalories: calories,
      setLogs: logs,
    });

    completeTodayWorkout();
    awardAction("workout_completed");
    scheduleSafeAutoSync();

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
        Edite carga, repetições e séries de cada exercício e marque o que concluir.
      </KairosText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
        <KairosInput
          label="Duração (min)"
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

      <View style={{ gap: 14, marginTop: 24 }}>
        {grouped.map((group) => (
          <KairosCard key={group.exerciseId} style={{ borderRadius: 18 }}>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {group.name}
            </KairosText>

            {/* cabeçalho da tabela */}
            <View style={{ flexDirection: "row", marginTop: 14, paddingHorizontal: 2 }}>
              <KairosText variant="subtitle" style={{ width: 40 }}>
                Sér.
              </KairosText>
              <KairosText variant="subtitle" style={{ flex: 1, textAlign: "center" }}>
                Reps
              </KairosText>
              <KairosText variant="subtitle" style={{ flex: 1, textAlign: "center" }}>
                Carga
              </KairosText>
              <View style={{ width: 44 }} />
              <View style={{ width: 36 }} />
            </View>

            {group.sets.map((setLog) => (
              <View
                key={setLog.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <KairosText
                  variant="body"
                  color={colors.gold}
                  style={{ width: 40, fontWeight: "900" }}
                >
                  {setLog.setNumber}
                </KairosText>

                <View style={{ flex: 1, paddingHorizontal: 4 }}>
                  <KairosInput
                    keyboardType="numeric"
                    value={String(setLog.reps)}
                    onChangeText={(text) =>
                      updateSet(setLog.id, { reps: Math.round(toNumber(text)) })
                    }
                    style={{ padding: 12, textAlign: "center" }}
                  />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 4 }}>
                  <KairosInput
                    keyboardType="numeric"
                    value={String(setLog.weightKg)}
                    onChangeText={(text) => updateSet(setLog.id, { weightKg: toNumber(text) })}
                    style={{ padding: 12, textAlign: "center" }}
                  />
                </View>

                <Pressable
                  onPress={() => toggleSet(setLog.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    marginLeft: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: setLog.completed ? colors.success : colors.border,
                    backgroundColor: setLog.completed ? "rgba(34,197,94,0.16)" : "transparent",
                  }}
                >
                  {setLog.completed ? <Check color={colors.success} size={18} /> : null}
                </Pressable>

                <Pressable
                  onPress={() => removeSet(setLog.id)}
                  style={{
                    width: 28,
                    marginLeft: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 color={colors.mutedDark} size={16} />
                </Pressable>
              </View>
            ))}

            <Pressable
              onPress={() => addSet(group.exerciseId, group.name)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
              }}
            >
              <Plus color={colors.purple} size={16} />
              <KairosText variant="subtitle" color={colors.purple}>
                Adicionar série
              </KairosText>
            </Pressable>
          </KairosCard>
        ))}
      </View>

      {/* adicionar exercício avulso */}
      <KairosCard style={{ marginTop: 14, borderRadius: 18 }}>
        <KairosText variant="label" color={colors.gold}>
          Adicionar exercício
        </KairosText>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12, alignItems: "flex-end" }}>
          <KairosInput
            placeholder="Ex: Crucifixo"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
          />
          <Pressable
            onPress={addExercise}
            style={{
              width: 54,
              height: 54,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.borderPurple,
            }}
          >
            <Plus color={colors.purple} size={22} />
          </Pressable>
        </View>
      </KairosCard>

      {/* resumo ao vivo */}
      <KairosCard variant="gold" style={{ marginTop: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <KairosText variant="subtitle">Séries concluídas</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
              {completedCount} / {logs.length}
            </KairosText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <KairosText variant="subtitle">Volume</KairosText>
            <KairosText
              variant="body"
              color={colors.gold}
              style={{ fontWeight: "900", marginTop: 2 }}
            >
              {Math.round(totalVolume).toLocaleString("pt-BR")} kg
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <KairosButton style={{ marginTop: 22 }} onPress={finishWorkout}>
        Finalizar treino
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}
