import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { getSleepAnalytics } from "@/features/sleep/sleep-analytics.service";
import type { SleepRange } from "@/features/sleep/sleep.types";
import { useSleepStore } from "@/stores/sleep.store";
import { colors, radius } from "@/styles/theme";
import { Moon, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${String(remainingMinutes).padStart(2, "0")}min`;
}

function formatNight(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

const RANGES: { key: SleepRange; label: string }[] = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
];

export default function SleepHistoryScreen() {
  const sleepLogs = useSleepStore((state) => state.sleepLogs);
  const [range, setRange] = useState<SleepRange>("7d");

  const analytics = useMemo(() => {
    return getSleepAnalytics(range);
  }, [range, sleepLogs]);

  const maxDuration = useMemo(() => {
    const max = Math.max(...analytics.series.map((point) => point.durationMinutes), 480);
    return max;
  }, [analytics.series]);

  return (
    <KairosScreen>
      <KairosHeader title="Sono" subtitle="Seu padrão de recuperação ao longo do tempo." />

      {/* seletor de período */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
        {RANGES.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setRange(item.key)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: radius.md,
              alignItems: "center",
              borderWidth: 1,
              borderColor: range === item.key ? colors.purple : colors.border,
              backgroundColor: range === item.key ? "rgba(124,92,255,0.12)" : colors.card,
            }}
          >
            <KairosText
              variant="subtitle"
              color={range === item.key ? colors.white : colors.muted}
              style={{ fontWeight: "800" }}
            >
              {item.label}
            </KairosText>
          </Pressable>
        ))}
      </View>

      {analytics.count === 0 ? (
        <KairosCard style={{ marginTop: 20 }}>
          <KairosText variant="body" style={{ fontWeight: "900" }}>
            Sem registros nesse período.
          </KairosText>
          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Registre seu sono para acompanhar médias e evolução.
          </KairosText>
        </KairosCard>
      ) : (
        <>
          {/* médias */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
            <KairosCard style={{ flex: 1 }}>
              <KairosText variant="subtitle">Média por noite</KairosText>
              <KairosText variant="body" style={{ fontWeight: "900", marginTop: 4 }}>
                {analytics.avgDurationText}
              </KairosText>
            </KairosCard>
            <KairosCard style={{ flex: 1 }}>
              <KairosText variant="subtitle">Consistência 7h+</KairosText>
              <KairosText
                variant="body"
                color={colors.success}
                style={{ fontWeight: "900", marginTop: 4 }}
              >
                {analytics.consistencyPct}%
              </KairosText>
            </KairosCard>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
            <KairosCard style={{ flex: 1 }}>
              <KairosText variant="subtitle">Qualidade média</KairosText>
              <KairosText
                variant="body"
                color={colors.gold}
                style={{ fontWeight: "900", marginTop: 4 }}
              >
                {analytics.avgQuality}/10
              </KairosText>
            </KairosCard>
            <KairosCard style={{ flex: 1 }}>
              <KairosText variant="subtitle">Energia média</KairosText>
              <KairosText
                variant="body"
                color={colors.blue}
                style={{ fontWeight: "900", marginTop: 4 }}
              >
                {analytics.avgEnergy}/10
              </KairosText>
            </KairosCard>
          </View>

          {/* gráfico de barras */}
          <KairosCard style={{ marginTop: 14 }}>
            <KairosText variant="label" color={colors.purple}>
              Horas por noite
            </KairosText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 6,
                height: 140,
                marginTop: 18,
              }}
            >
              {analytics.series.map((point, index) => {
                const heightPct = Math.max(
                  6,
                  Math.round((point.durationMinutes / maxDuration) * 100)
                );
                const isGood = point.durationMinutes >= 420;

                return (
                  <View key={index} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                    <View
                      style={{
                        width: "100%",
                        height: `${heightPct}%`,
                        borderRadius: 6,
                        backgroundColor: isGood ? colors.purple : colors.mutedDark,
                        minHeight: 8,
                      }}
                    />
                    <KairosText variant="subtitle" style={{ fontSize: 9 }}>
                      {point.label}
                    </KairosText>
                  </View>
                );
              })}
            </View>
          </KairosCard>

          {/* insight da Kairos */}
          <KairosCard variant="purple" style={{ marginTop: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Sparkles color={colors.purple} size={22} />
              <KairosText variant="label" color={colors.purple}>
                Insight da Kairos
              </KairosText>
            </View>
            <KairosText variant="body" style={{ marginTop: 12, lineHeight: 22 }}>
              {analytics.insight}
            </KairosText>
          </KairosCard>

          {/* lista de noites */}
          <KairosText variant="label" color={colors.gold} style={{ marginTop: 24 }}>
            Noites registradas
          </KairosText>

          <View style={{ gap: 12, marginTop: 14 }}>
            {sleepLogs.slice(0, 20).map((log) => (
              <KairosCard key={log.id} style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Moon color={colors.purple} size={20} />
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {formatNight(log.sleptAt)}
                    </KairosText>
                  </View>
                  <KairosText variant="body" style={{ fontWeight: "900" }}>
                    {formatDuration(log.durationMinutes)}
                  </KairosText>
                </View>

                <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
                  <KairosText variant="subtitle">Qualidade {log.qualityScore}/10</KairosText>
                  <KairosText variant="subtitle">Energia {log.energyScore}/10</KairosText>
                  {log.interruptions > 0 ? (
                    <KairosText variant="subtitle">{log.interruptions} interrupções</KairosText>
                  ) : null}
                </View>
              </KairosCard>
            ))}
          </View>
        </>
      )}
    </KairosScreen>
  );
}
