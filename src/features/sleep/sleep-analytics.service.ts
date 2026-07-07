import type {
  SleepAnalytics,
  SleepDayPoint,
  SleepLog,
  SleepRange,
} from "@/features/sleep/sleep.types";
import { useSleepStore } from "@/stores/sleep.store";

const GOOD_SLEEP_MINUTES = 420; // 7h

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${String(remainingMinutes).padStart(2, "0")}min`;
}

function rangeDays(range: SleepRange) {
  return range === "7d" ? 7 : 30;
}

function isWithinRange(dateIso: string, days: number) {
  const target = new Date(dateIso).getTime();
  const limit = Date.now() - days * 24 * 60 * 60 * 1000;
  return target >= limit;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function buildInsight(analytics: Omit<SleepAnalytics, "insight">): string {
  if (analytics.count === 0) {
    return "Registre algumas noites para a Kairos analisar seu padrão de sono.";
  }

  const parts: string[] = [];

  if (analytics.avgDurationMinutes < 390) {
    parts.push(
      `Sua média está em ${analytics.avgDurationText}, abaixo das 7h. Esse déficit tende a elevar a fome e prejudicar a recuperação muscular. Antecipe o horário de dormir em 30 a 45 minutos.`
    );
  } else if (analytics.avgDurationMinutes < GOOD_SLEEP_MINUTES) {
    parts.push(
      `Você está perto do ideal com ${analytics.avgDurationText}. Ganhar mais 20 a 30 minutos por noite já coloca sua recuperação em outro patamar.`
    );
  } else {
    parts.push(
      `Ótima base: média de ${analytics.avgDurationText} por noite. Manter essa consistência sustenta seu desempenho e composição corporal.`
    );
  }

  if (analytics.avgInterruptions >= 2) {
    parts.push(
      "Suas noites têm interrupções frequentes; reduzir cafeína à tarde e telas antes de dormir ajuda a consolidar o sono."
    );
  } else if (analytics.avgQuality > 0 && analytics.avgQuality < 6) {
    parts.push(
      "A qualidade percebida está baixa; escurecer e resfriar o quarto costuma elevar bastante esse número."
    );
  }

  return parts.join(" ");
}

export function getSleepAnalytics(range: SleepRange): SleepAnalytics {
  const days = rangeDays(range);
  const allLogs = useSleepStore.getState().sleepLogs;

  const logs = allLogs.filter((log) => isWithinRange(log.sleptAt, days));

  const durations = logs.map((log) => log.durationMinutes);
  const qualities = logs.map((log) => log.qualityScore);
  const energies = logs.map((log) => log.energyScore);
  const interruptions = logs.map((log) => log.interruptions);

  const avgDurationMinutes = Math.round(average(durations));
  const goodNights = logs.filter((log) => log.durationMinutes >= GOOD_SLEEP_MINUTES).length;

  // série cronológica (mais antigo -> mais recente), no máximo 14 pontos para o gráfico
  const chronological: SleepLog[] = [...logs].sort(
    (a, b) => new Date(a.sleptAt).getTime() - new Date(b.sleptAt).getTime()
  );

  const windowed = chronological.slice(-14);

  const series: SleepDayPoint[] = windowed.map((log) => {
    const date = new Date(log.sleptAt);
    return {
      label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      durationMinutes: log.durationMinutes,
      qualityScore: log.qualityScore,
    };
  });

  const base = {
    range,
    count: logs.length,
    avgDurationMinutes,
    avgDurationText: formatDuration(avgDurationMinutes),
    avgQuality: Math.round(average(qualities) * 10) / 10,
    avgEnergy: Math.round(average(energies) * 10) / 10,
    avgInterruptions: Math.round(average(interruptions) * 10) / 10,
    consistencyPct: logs.length > 0 ? Math.round((goodNights / logs.length) * 100) : 0,
    series,
  };

  return {
    ...base,
    insight: buildInsight(base),
  };
}
