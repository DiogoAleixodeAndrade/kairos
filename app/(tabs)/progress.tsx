import { KairosStatCard } from "@/components/cards/KairosStatCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { useProgressStore } from "@/stores/progress.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Camera, Ruler, Scale } from "lucide-react-native";
import { useMemo } from "react";
import { Image, View } from "react-native";

export default function ProgressScreen() {
  const startWeightKg = useProgressStore((state) => state.startWeightKg);
  const targetWeightKg = useProgressStore((state) => state.targetWeightKg);
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const measurements = useProgressStore((state) => state.measurements);
  const photos = useProgressStore((state) => state.photos);

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