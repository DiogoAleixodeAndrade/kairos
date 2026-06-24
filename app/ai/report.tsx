import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useAIStore } from "@/stores/ai.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { View } from "react-native";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function AIReportScreen() {
  const report = useAIStore((state) => state.getLatestReport());

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
          Pontos positivos
        </KairosText>

        <View style={{ gap: 10, marginTop: 12 }}>
          {report.positives.map((item) => (
            <KairosText key={item} variant="body">
              • {item}
            </KairosText>
          ))}
        </View>
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Pontos de atenção
        </KairosText>

        <View style={{ gap: 10, marginTop: 12 }}>
          {report.attentionPoints.map((item) => (
            <KairosText key={item} variant="body">
              • {item}
            </KairosText>
          ))}
        </View>
      </KairosCard>

      <KairosCard variant="gold" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.gold}>
          Ação recomendada
        </KairosText>

        <KairosText variant="body" style={{ marginTop: 12, fontWeight: "900" }}>
          {report.recommendation}
        </KairosText>
      </KairosCard>

      <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
        Voltar
      </KairosButton>
    </KairosScreen>
  );
}