import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { getProgressAnalytics } from "@/features/progress/progress-analytics.service";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useProgressStore } from "@/stores/progress.store";
import { colors, radius } from "@/styles/theme";
import { router } from "expo-router";
import {
  Camera,
  ChevronRight,
  Pencil,
  Ruler,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Image, Pressable, View } from "react-native";

export default function ProgressScreen() {
  const startWeightKg = useProgressStore((state) => state.startWeightKg);
  const targetWeightKg = useProgressStore((state) => state.targetWeightKg);
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const measurements = useProgressStore((state) => state.measurements);
  const photos = useProgressStore((state) => state.photos);
  const setTargetWeight = useProgressStore((state) => state.setTargetWeight);

  const analytics = useMemo(() => getProgressAnalytics(), [weightLogs]);

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(targetWeightKg));

  function saveGoal() {
    const normalized = Number(goalInput.replace(",", "."));
    if (Number.isFinite(normalized) && normalized > 0) {
      setTargetWeight(normalized);
      scheduleSafeAutoSync();
    }
    setIsEditingGoal(false);
  }

  const latestWeightLog = useMemo(() => {
    if (weightLogs.length === 0) {
      return null;
    }

    return [...weightLogs].sort((a, b) => {
      return new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime();
    })[0];
  }, [weightLogs]);

  const latestMeasurement = useMemo(() => {
    if (measurements.length === 0) {
      return null;
    }

    return [...measurements].sort((a, b) => {
      return new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime();
    })[0];
  }, [measurements]);

  const latestPhoto = useMemo(() => {
    if (photos.length === 0) {
      return null;
    }

    return [...photos].sort((a, b) => {
      return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
    })[0];
  }, [photos]);

  const summary = useMemo(() => {
    const currentWeightKg = latestWeightLog?.weightKg ?? startWeightKg;

    const lostWeightKg = Math.max(0, startWeightKg - currentWeightKg);
    const remainingWeightKg = Math.max(0, currentWeightKg - targetWeightKg);
    const totalGoalKg = Math.max(1, startWeightKg - targetWeightKg);
    const progressPercentage = Math.min(100, Math.round((lostWeightKg / totalGoalKg) * 100));

    return {
      startWeightKg,
      currentWeightKg,
      targetWeightKg,
      lostWeightKg,
      remainingWeightKg,
      progressPercentage,
      latestWaistCm: latestMeasurement?.waistCm,
      latestPhotoUri: latestPhoto?.uri,
    };
  }, [latestMeasurement, latestPhoto, latestWeightLog, startWeightKg, targetWeightKg]);

  return (
    <KairosScreen>
      <KairosHeader title="Progresso" subtitle="Cada escolha te move para frente." />

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Jornada de peso
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 14 }}>
          -{summary.lostWeightKg.toFixed(1)} kg
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 6 }}>
          De {summary.startWeightKg.toFixed(1)} kg para{" "}
          {summary.currentWeightKg.toFixed(1)} kg. Meta:{" "}
          {summary.targetWeightKg.toFixed(1)} kg.
        </KairosText>

        <KairosProgressBar
          value={summary.progressPercentage}
          max={100}
          color={colors.gold}
          style={{ marginTop: 18 }}
        />

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8, fontWeight: "900" }}>
          {summary.progressPercentage}% do caminho concluído
        </KairosText>

        {isEditingGoal ? (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16, alignItems: "flex-end" }}>
            <KairosInput
              label="Nova meta (kg)"
              keyboardType="numeric"
              value={goalInput}
              onChangeText={setGoalInput}
            />
            <Pressable
              onPress={saveGoal}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: radius.md,
                backgroundColor: colors.gold,
              }}
            >
              <KairosText variant="body" color={colors.background} style={{ fontWeight: "900" }}>
                Salvar
              </KairosText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => {
              setGoalInput(String(targetWeightKg));
              setIsEditingGoal(true);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 14,
            }}
          >
            <Pencil color={colors.gold} size={15} />
            <KairosText variant="subtitle" color={colors.gold} style={{ fontWeight: "800" }}>
              Editar meta de peso
            </KairosText>
          </Pressable>
        )}
      </KairosCard>

      {/* velocidade + previsão */}
      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {analytics.direction === "gaining" ? (
            <TrendingUp color={colors.purple} size={22} />
          ) : (
            <TrendingDown color={colors.purple} size={22} />
          )}
          <KairosText variant="label" color={colors.purple}>
            Ritmo atual
          </KairosText>
        </View>

        <KairosText variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
          {analytics.direction === "stable"
            ? "Seu peso está estável. Registre mais pesagens para a Kairos calcular sua velocidade."
            : `${
                analytics.direction === "losing" ? "Perdendo" : "Ganhando"
              } ${analytics.weeklyRateAbs.toFixed(2)} kg por semana.`}
          {analytics.weeksToGoal && analytics.estimatedDate
            ? ` Previsão de chegar à meta por volta de ${analytics.estimatedDate}.`
            : ""}
        </KairosText>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosStatCard
          label="Atual"
          value={`${summary.currentWeightKg.toFixed(1)}`}
          description="kg"
          accent="gold"
          style={{ flex: 1 }}
        />

        <KairosStatCard
          label="Faltam"
          value={`${summary.remainingWeightKg.toFixed(1)}`}
          description="kg até a meta"
          accent="purple"
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
        <KairosButton style={{ flex: 1 }} onPress={() => router.push("/progress/weight")}>
          Peso
        </KairosButton>

        <KairosButton
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => router.push("/progress/measurements")}
        >
          Medidas
        </KairosButton>
      </View>

      <KairosButton
        variant="secondary"
        style={{ marginTop: 12 }}
        onPress={() => router.push("/progress/photos")}
      >
        Fotos de evolução
      </KairosButton>

      {summary.latestPhotoUri ? (
        <KairosCard variant="purple" style={{ marginTop: 18 }}>
          <KairosText variant="label" color={colors.purple}>
            Foto mais recente
          </KairosText>

          <Image
            source={{ uri: summary.latestPhotoUri }}
            style={{
              width: "100%",
              height: 260,
              borderRadius: 22,
              marginTop: 14,
              backgroundColor: colors.backgroundSoft,
            }}
            resizeMode="cover"
          />
        </KairosCard>
      ) : null}

      <Pressable
        onPress={() => router.push("/progress/history")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 18,
          padding: 18,
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <KairosText variant="body" style={{ fontWeight: "900" }}>
          Ver evolução completa
        </KairosText>
        <ChevronRight color={colors.muted} size={20} />
      </Pressable>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Registros
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        <KairosCard style={{ borderRadius: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Scale color={colors.gold} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="body" style={{ fontWeight: "900" }}>
                Pesos registrados
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                {weightLogs.length} registros
              </KairosText>
            </View>
          </View>
        </KairosCard>

        <KairosCard style={{ borderRadius: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ruler color={colors.purple} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="body" style={{ fontWeight: "900" }}>
                Medidas registradas
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                {measurements.length} registros
              </KairosText>
            </View>
          </View>
        </KairosCard>

        <KairosCard style={{ borderRadius: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Camera color={colors.blue} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="body" style={{ fontWeight: "900" }}>
                Fotos de evolução
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                {photos.length} fotos
              </KairosText>
            </View>
          </View>
        </KairosCard>
      </View>
    </KairosScreen>
  );
}