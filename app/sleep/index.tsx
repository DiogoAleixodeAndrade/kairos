import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { getSleepAnalytics } from "@/features/sleep/sleep-analytics.service";
import { useSleepStore } from "@/stores/sleep.store";
import { colors, radius } from "@/styles/theme";
import { router } from "expo-router";
import { ChevronRight, Moon, Sunrise } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, View } from "react-native";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h${String(remainingMinutes).padStart(2, "0")}min`;
}

export default function SleepScreen() {
  const sleepLogs = useSleepStore((state) => state.sleepLogs);

  const lastSleepLog = useMemo(() => {
    return sleepLogs[0] ?? null;
  }, [sleepLogs]);

  const summary = useMemo(() => {
    if (!lastSleepLog) {
      return {
        durationMinutes: 0,
        durationText: "0h00min",
        qualityScore: 0,
        energyScore: 0,
        interruptions: 0,
      };
    }

    return {
      durationMinutes: lastSleepLog.durationMinutes,
      durationText: formatDuration(lastSleepLog.durationMinutes),
      qualityScore: lastSleepLog.qualityScore,
      energyScore: lastSleepLog.energyScore,
      interruptions: lastSleepLog.interruptions,
    };
  }, [lastSleepLog]);

  const targetMinutes = 450;

  const weeklyAnalytics = useMemo(() => {
    return getSleepAnalytics("7d");
  }, [sleepLogs]);

  const sleepPercentage =
    targetMinutes > 0
      ? Math.min(100, Math.round((summary.durationMinutes / targetMinutes) * 100))
      : 0;

  return (
    <KairosScreen>
      <KairosHeader title="Sono" subtitle="Sua recuperação define a qualidade da sua evolução." />

      <KairosCard variant="purple" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Moon color={colors.purple} size={28} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.purple}>
              Última noite
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 10 }}>
              {summary.durationText}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              Meta ideal: 7h30min
            </KairosText>
          </View>
        </View>

        <KairosProgressBar
          value={summary.durationMinutes}
          max={targetMinutes}
          color={colors.purple}
          style={{ marginTop: 18 }}
        />

        <KairosText
          variant="body"
          color={colors.purple}
          style={{ marginTop: 8, fontWeight: "900" }}
        >
          {sleepPercentage}% da meta
        </KairosText>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.gold}>
            Qualidade
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {summary.qualityScore}/10
          </KairosText>
        </KairosCard>

        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.blue}>
            Energia
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {summary.energyScore}/10
          </KairosText>
        </KairosCard>
      </View>

      <KairosCard variant="blue" style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Sunrise color={colors.blue} size={26} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.blue}>
              Análise da semana
            </KairosText>

            <KairosText variant="body" style={{ marginTop: 10, lineHeight: 22 }}>
              {weeklyAnalytics.count > 0
                ? weeklyAnalytics.insight
                : summary.durationMinutes >= 420
                  ? "Seu sono ficou dentro de uma boa faixa. Mantenha a consistência do horário."
                  : "Seu sono ficou abaixo do ideal. Hoje tente antecipar sua rotina noturna."}
            </KairosText>

            <KairosText variant="body" style={{ marginTop: 10 }}>
              {summary.durationMinutes >= 420
                ? "Seu sono ficou dentro de uma boa faixa. Mantenha a consistência do horário."
                : "Seu sono ficou abaixo do ideal. Hoje tente antecipar sua rotina noturna."}
            </KairosText>
          </View>
        </View>
      </KairosCard>

      {lastSleepLog?.notes ? (
        <KairosCard style={{ marginTop: 14 }}>
          <KairosText variant="label" color={colors.gold}>
            Observação
          </KairosText>

          <KairosText variant="body" style={{ marginTop: 10 }}>
            {lastSleepLog.notes}
          </KairosText>
        </KairosCard>
      ) : null}

      <Pressable
        onPress={() => router.push("/sleep/history")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 28,
          padding: 18,
          borderRadius: radius.lg,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <KairosText variant="body" style={{ fontWeight: "900" }}>
          Ver histórico e médias
        </KairosText>
        <ChevronRight color={colors.muted} size={20} />
      </Pressable>

      <KairosButton style={{ marginTop: 12 }} onPress={() => router.push("/sleep/add")}>
        Registrar sono
      </KairosButton>
    </KairosScreen>
  );
}
