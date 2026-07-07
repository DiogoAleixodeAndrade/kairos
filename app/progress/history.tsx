import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import {
  getMeasurementDeltas,
  getPhotoComparison,
  getProgressAnalytics,
} from "@/features/progress/progress-analytics.service";
import { useProgressStore } from "@/stores/progress.store";
import { colors } from "@/styles/theme";
import { ArrowRight, Sparkles, TrendingDown, TrendingUp } from "lucide-react-native";
import { useMemo } from "react";
import { Image, View } from "react-native";
import Svg, { Circle, Path, Line as SvgLine } from "react-native-svg";

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PAD = 18;

function WeightChart({ points }: { points: number[] }) {
  if (points.length < 2) {
    return (
      <KairosText variant="subtitle" style={{ marginTop: 12 }}>
        Registre pelo menos dois pesos para ver a curva.
      </KairosText>
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const innerW = CHART_WIDTH - PAD * 2;
  const innerH = CHART_HEIGHT - PAD * 2;

  const coords = points.map((value, index) => {
    const x = PAD + (index / (points.length - 1)) * innerW;
    const y = PAD + (1 - (value - min) / range) * innerH;
    return { x, y };
  });

  const pathD = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
      <SvgLine
        x1={PAD}
        y1={CHART_HEIGHT - PAD}
        x2={CHART_WIDTH - PAD}
        y2={CHART_HEIGHT - PAD}
        stroke={colors.border}
        strokeWidth={1}
      />
      <Path d={pathD} stroke={colors.success} strokeWidth={3} fill="none" />
      {coords.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={3.5} fill={colors.success} />
      ))}
    </Svg>
  );
}

export default function ProgressHistoryScreen() {
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const measurements = useProgressStore((state) => state.measurements);
  const photos = useProgressStore((state) => state.photos);

  const analytics = useMemo(() => getProgressAnalytics(), [weightLogs]);
  const deltas = useMemo(() => getMeasurementDeltas(), [measurements]);
  const comparison = useMemo(() => getPhotoComparison(), [photos]);

  const chartPoints = useMemo(
    () => analytics.series.map((point) => point.weightKg),
    [analytics.series]
  );

  const rateLabel =
    analytics.direction === "losing"
      ? `-${analytics.weeklyRateAbs.toFixed(2)} kg/semana`
      : analytics.direction === "gaining"
        ? `+${analytics.weeklyRateAbs.toFixed(2)} kg/semana`
        : "Estável";

  return (
    <KairosScreen>
      <KairosHeader title="Evolução" subtitle="Sua trajetória em números." />

      {/* gráfico de peso */}
      <KairosCard style={{ marginTop: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <KairosText variant="label" color={colors.success}>
            Curva de peso
          </KairosText>
          <KairosText variant="body" color={colors.success} style={{ fontWeight: "900" }}>
            {analytics.currentWeightKg.toFixed(1)} kg
          </KairosText>
        </View>

        <View style={{ marginTop: 16 }}>
          <WeightChart points={chartPoints} />
        </View>
      </KairosCard>

      {/* velocidade + previsão */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <KairosCard style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {analytics.direction === "gaining" ? (
              <TrendingUp color={colors.gold} size={16} />
            ) : (
              <TrendingDown color={colors.success} size={16} />
            )}
            <KairosText variant="subtitle">Velocidade</KairosText>
          </View>
          <KairosText variant="body" style={{ fontWeight: "900", marginTop: 6 }}>
            {rateLabel}
          </KairosText>
        </KairosCard>

        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="subtitle">Faltam</KairosText>
          <KairosText
            variant="body"
            color={colors.gold}
            style={{ fontWeight: "900", marginTop: 6 }}
          >
            {analytics.remainingKg.toFixed(1)} kg
          </KairosText>
        </KairosCard>
      </View>

      {/* previsão até a meta */}
      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Sparkles color={colors.purple} size={22} />
          <KairosText variant="label" color={colors.purple}>
            Previsão até a meta
          </KairosText>
        </View>

        <KairosText variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
          {analytics.weeksToGoal && analytics.estimatedDate
            ? `No ritmo atual de ${analytics.weeklyRateAbs.toFixed(
                2
              )} kg por semana, você chega aos ${analytics.targetWeightKg.toFixed(
                1
              )} kg em cerca de ${analytics.weeksToGoal} semana${
                analytics.weeksToGoal > 1 ? "s" : ""
              }, por volta de ${analytics.estimatedDate}.`
            : analytics.remainingKg <= 0.1
              ? "Você já está na sua meta. Hora de definir o próximo objetivo."
              : "Ainda não há dados suficientes de tendência na direção da meta. Registre seu peso com regularidade para a Kairos projetar sua data."}
        </KairosText>
      </KairosCard>

      {/* comparativo de fotos */}
      {comparison ? (
        <KairosCard variant="purple" style={{ marginTop: 14 }}>
          <KairosText variant="label" color={colors.purple}>
            Transformação
          </KairosText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: comparison.before.uri }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 16,
                  backgroundColor: colors.backgroundSoft,
                }}
                resizeMode="cover"
              />
              <KairosText variant="subtitle" style={{ marginTop: 6, textAlign: "center" }}>
                Antes
              </KairosText>
            </View>

            <ArrowRight color={colors.purple} size={22} />

            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: comparison.after.uri }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 16,
                  backgroundColor: colors.backgroundSoft,
                }}
                resizeMode="cover"
              />
              <KairosText variant="subtitle" style={{ marginTop: 6, textAlign: "center" }}>
                Agora
              </KairosText>
            </View>
          </View>
        </KairosCard>
      ) : null}

      {/* histórico de medidas */}
      {deltas.length > 0 ? (
        <>
          <KairosText variant="label" color={colors.gold} style={{ marginTop: 24 }}>
            Medidas atuais
          </KairosText>

          <KairosCard style={{ marginTop: 14 }}>
            {deltas.map((delta, index) => (
              <View
                key={delta.key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: colors.border,
                }}
              >
                <KairosText variant="body">{delta.label}</KairosText>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <KairosText variant="body" style={{ fontWeight: "900" }}>
                    {delta.current} cm
                  </KairosText>

                  {typeof delta.deltaCm === "number" && delta.deltaCm !== 0 ? (
                    <KairosText
                      variant="subtitle"
                      color={delta.deltaCm < 0 ? colors.success : colors.gold}
                      style={{ fontWeight: "800" }}
                    >
                      {delta.deltaCm < 0 ? "↓" : "↑"} {Math.abs(delta.deltaCm)} cm
                    </KairosText>
                  ) : null}
                </View>
              </View>
            ))}
          </KairosCard>
        </>
      ) : null}
    </KairosScreen>
  );
}
