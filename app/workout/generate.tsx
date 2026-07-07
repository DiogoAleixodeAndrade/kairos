import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import {
  buildDefaultTrainingInput,
  generateTrainingPlan,
} from "@/features/training/generate-training-plan.service";
import type { GeneratedTrainingPlan } from "@/features/training/training.types";
import { useTrainingStore } from "@/stores/training.store";
import { colors, radius } from "@/styles/theme";
import { router } from "expo-router";
import { Dumbbell, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";

const OBJECTIVES = [
  { key: "perda de gordura", label: "Perda de gordura", description: "Definir e secar" },
  { key: "ganho de massa", label: "Ganho de massa", description: "Construir músculo" },
  { key: "manutenção", label: "Manutenção", description: "Manter e evoluir" },
];

const LEVELS = [
  { key: "iniciante", label: "Iniciante" },
  { key: "intermediario", label: "Intermediário" },
  { key: "avancado", label: "Avançado" },
];

const DAYS = [3, 4, 5, 6];

export default function GenerateTrainingScreen() {
  const applyGeneratedPlan = useTrainingStore((state) => state.applyGeneratedPlan);

  const base = buildDefaultTrainingInput();

  const [objective, setObjective] = useState(base.objective);
  const [level, setLevel] = useState(base.level);
  const [daysPerWeek, setDaysPerWeek] = useState(base.daysPerWeek);
  const [sessionMinutes, setSessionMinutes] = useState(String(base.sessionMinutes));
  const [restrictions, setRestrictions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<GeneratedTrainingPlan | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setPlan(null);

    try {
      const generated = await generateTrainingPlan({
        displayName: base.displayName,
        objective,
        level,
        weightKg: base.weightKg,
        daysPerWeek,
        sessionMinutes: Number(sessionMinutes) || 60,
        restrictions: restrictions.trim(),
      });

      setPlan(generated);
    } catch (error) {
      Alert.alert(
        "Não foi possível gerar",
        error instanceof Error ? error.message : "Tente novamente em instantes."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleApply() {
    if (!plan) return;

    applyGeneratedPlan(plan);
    scheduleSafeAutoSync();

    Alert.alert("Plano aplicado", "Sua nova divisão semanal já está ativa.");
    router.replace("/(tabs)/training");
  }

  if (isGenerating) {
    return (
      <KairosScreen>
        <View style={{ alignItems: "center", marginTop: 80 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.borderPurple,
              backgroundColor: "rgba(124,92,255,0.10)",
            }}
          >
            <Sparkles color={colors.purple} size={44} />
          </View>

          <KairosText variant="title" style={{ marginTop: 32, textAlign: "center", fontSize: 30 }}>
            Montando seu plano
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 10, textAlign: "center" }}>
            A Kairos AI está analisando seu perfil e desenhando sua divisão semanal.
          </KairosText>

          <ActivityIndicator color={colors.purple} size="large" style={{ marginTop: 36 }} />

          <KairosText variant="subtitle" style={{ marginTop: 16, textAlign: "center" }}>
            Isso leva alguns segundos.
          </KairosText>
        </View>
      </KairosScreen>
    );
  }

  if (plan) {
    return (
      <KairosScreen>
        <KairosText variant="label" color={colors.purple}>
          Plano gerado pela IA
        </KairosText>

        <KairosText variant="title" style={{ marginTop: 16, fontSize: 34 }}>
          Sua nova divisão
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 10 }}>
          Revise abaixo e aplique para ativar como seu plano semanal.
        </KairosText>

        <View style={{ gap: 12, marginTop: 24 }}>
          {plan.workouts.map((workout) => (
            <KairosCard key={workout.id} style={{ borderRadius: 18 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Dumbbell color={colors.purple} size={22} />
                <View style={{ flex: 1 }}>
                  <KairosText variant="body" style={{ fontWeight: "900" }}>
                    {workout.title}
                  </KairosText>
                  <KairosText variant="subtitle" style={{ marginTop: 2 }}>
                    {workout.subtitle}
                  </KairosText>
                </View>
                <KairosText variant="subtitle">{workout.durationMinutes} min</KairosText>
              </View>

              <View style={{ gap: 4, marginTop: 12 }}>
                {workout.exercises.map((exercise, index) => (
                  <KairosText key={index} variant="subtitle">
                    • {exercise.name} — {exercise.targetSets}x{exercise.targetReps}
                  </KairosText>
                ))}
              </View>
            </KairosCard>
          ))}
        </View>

        <KairosButton style={{ marginTop: 24 }} onPress={handleApply}>
          Aplicar este plano
        </KairosButton>

        <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => setPlan(null)}>
          Ajustar e gerar de novo
        </KairosButton>
      </KairosScreen>
    );
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.purple}>
        Treino com IA
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 16, fontSize: 34 }}>
        Gerar plano
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Ajuste as informações e deixe a Kairos AI montar sua divisão semanal.
      </KairosText>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Objetivo
      </KairosText>
      <View style={{ gap: 10, marginTop: 12 }}>
        {OBJECTIVES.map((item) => (
          <KairosOptionCard
            key={item.key}
            title={item.label}
            description={item.description}
            selected={objective === item.key}
            onPress={() => setObjective(item.key)}
          />
        ))}
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 24 }}>
        Nível
      </KairosText>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        {LEVELS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setLevel(item.key)}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: radius.md,
              alignItems: "center",
              borderWidth: 1,
              borderColor: level === item.key ? colors.purple : colors.border,
              backgroundColor: level === item.key ? "rgba(124,92,255,0.12)" : colors.card,
            }}
          >
            <KairosText
              variant="subtitle"
              color={level === item.key ? colors.white : colors.muted}
              style={{ fontWeight: "800" }}
            >
              {item.label}
            </KairosText>
          </Pressable>
        ))}
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 24 }}>
        Dias por semana
      </KairosText>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        {DAYS.map((day) => (
          <Pressable
            key={day}
            onPress={() => setDaysPerWeek(day)}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: radius.md,
              alignItems: "center",
              borderWidth: 1,
              borderColor: daysPerWeek === day ? colors.purple : colors.border,
              backgroundColor: daysPerWeek === day ? "rgba(124,92,255,0.12)" : colors.card,
            }}
          >
            <KairosText
              variant="body"
              style={{ fontWeight: "900" }}
              color={daysPerWeek === day ? colors.white : colors.muted}
            >
              {day}
            </KairosText>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <KairosInput
          label="Duração por sessão (min)"
          keyboardType="numeric"
          value={sessionMinutes}
          onChangeText={setSessionMinutes}
        />
      </View>

      <View style={{ marginTop: 18 }}>
        <KairosInput
          label="Restrições ou lesões (opcional)"
          placeholder="Ex: dor no ombro, sem agachamento"
          value={restrictions}
          onChangeText={setRestrictions}
        />
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleGenerate}>
        Gerar meu plano
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}
