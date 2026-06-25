import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useAIStore } from "@/stores/ai.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function AIReportScreen() {
  const reports = useAIStore((state) => state.reports);

  const report = useMemo(() => {
    return reports[0] ?? null;
  }, [reports]);

  if (!report) {
    return (
      <KairosScreen>
        <KairosText variant="title">Sem relatório</KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 10 }}>
          Gere um relatório diário na aba Kairos AI para visualizar a análise completa.
        </KairosText>

        <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
          Voltar
        </KairosButton>
      </KairosScreen>
    );
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.gold}>
        Relatório diário
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        {report.title}
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Gerado em {formatDate(report.createdAt)}
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28, alignItems: "center" }}>
        <KairosText variant="label" color={colors.gold}>
          Score Kairos
        </KairosText>

        <KairosText variant="metric" style={{ fontSize: 64, marginTop: 10 }}>
          {report.consistencyScore}
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 4, textAlign: "center" }}>
          Pontuação geral do dia com base em alimentação, água, treino, sono e progresso.
        </KairosText>
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.white}>
          Resumo
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.summary}
        </KairosText>
      </KairosCard>

      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Recomendação principal
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.recommendation}
        </KairosText>
      </KairosCard>

      <KairosCard variant="gold" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Alimentação
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.nutritionFeedback}
        </KairosText>
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Treino
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.trainingFeedback}
        </KairosText>
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.blue}>
          Sono
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.sleepFeedback}
        </KairosText>
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Progresso
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12 }}>
          {report.progressFeedback}
        </KairosText>
      </KairosCard>

      <KairosCard variant="gold" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Próxima ação
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12, fontWeight: "900" }}>
          {report.nextAction}
        </KairosText>
      </KairosCard>

      <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
        Voltar
      </KairosButton>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}