import { useMemo } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  Brain,
  Camera,
  Droplets,
  Moon,
  Scale,
  Utensils,
} from "lucide-react-native";

import { KairosAIInsightCard } from "@/components/cards/KairosAIInsightCard";
import { KairosMacroCard } from "@/components/cards/KairosMacroCard";
import { KairosScoreCard } from "@/components/cards/KairosScoreCard";
import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosQuickAction } from "@/components/ui/KairosQuickAction";
import { KairosText } from "@/components/ui/KairosText";

import { dashboardMock } from "@/features/dashboard/dashboard.mock";
import { useAIStore } from "@/stores/ai.store";
import { useGamificationStore } from "@/stores/gamification.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";
import { useTrainingStore } from "@/stores/training.store";
import { colors } from "@/styles/theme";

export default function HomeScreen() {
  const targets = useNutritionStore((state) => state.targets);
  const meals = useNutritionStore((state) => state.meals);
  const waterLogs = useNutritionStore((state) => state.waterLogs);
  const getTodaySummary = useNutritionStore((state) => state.getTodaySummary);

  const nutritionSummary = useMemo(() => {
    return getTodaySummary();
  }, [getTodaySummary, meals, waterLogs]);

  const workouts = useTrainingStore((state) => state.workouts);
  const sessions = useTrainingStore((state) => state.sessions);
  const getTodayWorkout = useTrainingStore((state) => state.getTodayWorkout);

  const getCompletedWorkoutsThisWeek = useTrainingStore(
    (state) => state.getCompletedWorkoutsThisWeek
  );

  const todayWorkout = useMemo(() => {
    return getTodayWorkout();
  }, [getTodayWorkout, workouts]);

  const completedThisWeek = useMemo(() => {
    return getCompletedWorkoutsThisWeek();
  }, [getCompletedWorkoutsThisWeek, sessions]);

  const sleepLogs = useSleepStore((state) => state.sleepLogs);
  const getSleepSummary = useSleepStore((state) => state.getSleepSummary);

  const sleepSummary = useMemo(() => {
    return getSleepSummary();
  }, [getSleepSummary, sleepLogs]);

  const weightLogs = useProgressStore((state) => state.weightLogs);
  const measurements = useProgressStore((state) => state.measurements);
  const photos = useProgressStore((state) => state.photos);
  const startWeightKg = useProgressStore((state) => state.startWeightKg);
  const targetWeightKg = useProgressStore((state) => state.targetWeightKg);
  const getProgressSummary = useProgressStore((state) => state.getSummary);

  const progressSummary = useMemo(() => {
    return getProgressSummary();
  }, [
    getProgressSummary,
    weightLogs,
    measurements,
    photos,
    startWeightKg,
    targetWeightKg,
  ]);

  const totalXp = useGamificationStore((state) => state.totalXp);
  const getLevelInfo = useGamificationStore((state) => state.getLevelInfo);

  const levelInfo = useMemo(() => {
    return getLevelInfo();
  }, [getLevelInfo, totalXp]);

  const reports = useAIStore((state) => state.reports);
  const getLatestReport = useAIStore((state) => state.getLatestReport);

  const latestAIReport = useMemo(() => {
    return getLatestReport();
  }, [getLatestReport, reports]);

  const userName = dashboardMock.user.name;
  const streakDays = dashboardMock.user.streakDays;

  const caloriesCurrent = Math.round(nutritionSummary.caloriesKcal);
  const caloriesTarget = targets.caloriesKcal;

  const caloriesPercentage =
    caloriesTarget > 0
      ? Math.round((caloriesCurrent / caloriesTarget) * 100)
      : 0;

  const proteinCurrent = Math.round(nutritionSummary.proteinG);
  const carbsCurrent = Math.round(nutritionSummary.carbsG);
  const fatCurrent = Math.round(nutritionSummary.fatG);

  const waterLiters = nutritionSummary.waterMl / 1000;
  const waterTargetLiters = targets.waterMl / 1000;

  const trainingTitle = todayWorkout?.title ?? dashboardMock.training.title;
  const trainingSubtitle =
    todayWorkout?.subtitle ?? dashboardMock.training.subtitle;
  const trainingDurationMinutes =
    todayWorkout?.durationMinutes ?? dashboardMock.training.durationMinutes;
  const trainingEstimatedCalories =
    todayWorkout?.estimatedCalories ??
    dashboardMock.training.estimatedCalories;

  const sleepDuration = sleepSummary.durationText || dashboardMock.sleep.duration;
  const sleepQuality = sleepSummary.qualityScore || dashboardMock.sleep.quality;

  const currentWeightKg = progressSummary.currentWeightKg;
  const startWeightKgValue = progressSummary.startWeightKg;
  const targetWeightKgValue = progressSummary.targetWeightKg;
  const lostWeight = progressSummary.lostWeightKg;
  const weightProgress = progressSummary.progressPercentage;

  const aiMessage = latestAIReport?.recommendation ?? dashboardMock.ai.message;
  const score = latestAIReport?.consistencyScore ?? dashboardMock.score;

  return (
    <KairosScreen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <KairosLogo />

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.borderGold,
            paddingVertical: 8,
            paddingHorizontal: 14,
          }}
        >
          <KairosText
            variant="body"
            color={colors.gold}
            style={{
              fontSize: 13,
              fontWeight: "900",
            }}
          >
            Nv. {levelInfo.level}
          </KairosText>
        </View>
      </View>

      <KairosText variant="subtitle" style={{ marginTop: 32 }}>
        Bom dia,
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 4 }}>
        {userName} ✦
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 6 }}>
        Hoje é o momento certo para evoluir. Sequência atual: {streakDays} dias.
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.gold}>
              Calorias de hoje
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 18 }}>
              {caloriesCurrent}
            </KairosText>

            <KairosText variant="subtitle">
              de {caloriesTarget} kcal
            </KairosText>
          </View>

          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              borderWidth: 8,
              borderColor: "rgba(214,168,79,0.22)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KairosText
              variant="body"
              color={colors.gold}
              style={{
                fontSize: 22,
                fontWeight: "900",
              }}
            >
              {caloriesPercentage}%
            </KairosText>
          </View>
        </View>

        <KairosProgressBar
          value={caloriesCurrent}
          max={caloriesTarget}
          color={colors.gold}
          style={{ marginTop: 18 }}
        />
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.white}>
          Macros
        </KairosText>

        <View style={{ gap: 18, marginTop: 18 }}>
          <KairosMacroCard
            label="Proteína"
            current={proteinCurrent}
            target={targets.proteinG}
            unit="g"
            color={colors.gold}
          />

          <KairosMacroCard
            label="Carboidratos"
            current={carbsCurrent}
            target={targets.carbsG}
            unit="g"
            color={colors.blue}
          />

          <KairosMacroCard
            label="Gorduras"
            current={fatCurrent}
            target={targets.fatG}
            unit="g"
            color={colors.purple}
          />
        </View>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosStatCard
          label="Água"
          value={`${waterLiters.toFixed(1)}L`}
          description={`meta ${waterTargetLiters.toFixed(1)}L`}
          accent="blue"
          style={{ flex: 1 }}
        />

        <KairosStatCard
          label="Sono"
          value={sleepDuration}
          description={`qualidade ${sleepQuality}/10`}
          accent="purple"
          style={{ flex: 1 }}
        />
      </View>

      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Treino de hoje
        </KairosText>

        <KairosText
          variant="body"
          style={{
            fontSize: 26,
            fontWeight: "900",
            marginTop: 12,
          }}
        >
          {trainingTitle}
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4 }}>
          {trainingSubtitle}
        </KairosText>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <View style={{ flex: 1 }}>
            <KairosText variant="subtitle">Duração</KairosText>

            <KairosText
              variant="body"
              style={{
                fontWeight: "900",
                marginTop: 2,
              }}
            >
              {trainingDurationMinutes} min
            </KairosText>
          </View>

          <View style={{ flex: 1 }}>
            <KairosText variant="subtitle">Estimativa</KairosText>

            <KairosText
              variant="body"
              style={{
                fontWeight: "900",
                marginTop: 2,
              }}
            >
              {trainingEstimatedCalories} kcal
            </KairosText>
          </View>
        </View>

        <KairosText variant="subtitle" style={{ marginTop: 14 }}>
          {completedThisWeek} treinos concluídos nesta semana.
        </KairosText>
      </KairosCard>

      <KairosCard variant="gold" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Jornada de peso
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 12 }}>
          -{lostWeight.toFixed(1)} kg
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4 }}>
          De {startWeightKgValue.toFixed(1)} kg para{" "}
          {currentWeightKg.toFixed(1)} kg. Meta:{" "}
          {targetWeightKgValue.toFixed(1)} kg.
        </KairosText>

        <KairosProgressBar
          value={weightProgress}
          max={100}
          color={colors.gold}
          style={{ marginTop: 16 }}
        />

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8 }}>
          {weightProgress}% do caminho concluído
        </KairosText>
      </KairosCard>

      <View style={{ marginTop: 14 }}>
        <KairosScoreCard score={score} />
      </View>

      <View style={{ marginTop: 14 }}>
        <KairosAIInsightCard message={aiMessage} />
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Ações rápidas
      </KairosText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <KairosQuickAction
          title="Refeição"
          subtitle="Registrar agora"
          icon={<Utensils color={colors.gold} size={24} />}
          onPress={() => router.push("/(tabs)/food")}
        />

        <KairosQuickAction
          title="Água"
          subtitle="Adicionar copo"
          icon={<Droplets color={colors.blue} size={24} />}
          onPress={() => router.push("/(tabs)/food")}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <KairosQuickAction
          title="Peso"
          subtitle="Atualizar hoje"
          icon={<Scale color={colors.purple} size={24} />}
          onPress={() => router.push("/progress/weight")}
        />

        <KairosQuickAction
          title="Foto"
          subtitle="Evolução"
          icon={<Camera color={colors.gold} size={24} />}
          onPress={() => router.push("/progress/photos")}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
        <KairosQuickAction
          title="Sono"
          subtitle="Registrar noite"
          icon={<Moon color={colors.blue} size={24} />}
          onPress={() => router.push("/sleep")}
        />

        <KairosQuickAction
          title="IA"
          subtitle="Perguntar"
          icon={<Brain color={colors.purple} size={24} />}
          onPress={() => router.push("/(tabs)/ai")}
        />
      </View>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}