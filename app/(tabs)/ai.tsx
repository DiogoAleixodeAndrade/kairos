import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { useAIStore } from "@/stores/ai.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Brain, Send, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Alert, View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function AIScreen() {
  const [message, setMessage] = useState("");

  const reports = useAIStore((state) => state.reports);
  const messages = useAIStore((state) => state.messages);
  const latestReport = useAIStore((state) => state.getLatestReport());
  const generateReport = useAIStore((state) => state.generateReport);
  const sendMessage = useAIStore((state) => state.sendMessage);
  const clearMessages = useAIStore((state) => state.clearMessages);
  const isGeneratingReport = useAIStore((state) => state.isGeneratingReport);
  const isSendingMessage = useAIStore((state) => state.isSendingMessage);
  const awardAction = useGamificationStore((state) => state.awardAction);

  async function handleGenerateReport() {
    try {
      await generateReport();
      awardAction("ai_report_generated");
      Alert.alert("Relatório gerado", "A Kairos AI analisou seu dia.");
    } catch (error) {
      Alert.alert(
        "Erro na IA",
        error instanceof Error ? error.message : "Não foi possível gerar o relatório."
      );
    }
  }

  async function handleSendMessage() {
    const text = message.trim();

    if (!text) return;

    setMessage("");

    try {
      await sendMessage(text);
    } catch (error) {
      Alert.alert(
        "Erro na IA",
        error instanceof Error ? error.message : "Não foi possível enviar sua mensagem."
      );
    }
  }

  return (
    <KairosScreen>
      <KairosHeader title="Kairos AI" subtitle="Seu guia pessoal de performance." />

      <KairosCard variant="purple" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Brain color={colors.purple} size={28} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.purple}>
              Relatório diário
            </KairosText>

            <KairosText variant="body" style={{ fontSize: 22, fontWeight: "900", marginTop: 8 }}>
              Análise do seu dia
            </KairosText>
          </View>
        </View>

        <KairosText variant="subtitle" style={{ marginTop: 14 }}>
          A Kairos AI cruza alimentação, água, treino, sono e progresso para sugerir o próximo ajuste certo.
        </KairosText>

        <KairosButton
          style={{ marginTop: 18 }}
          loading={isGeneratingReport}
          onPress={handleGenerateReport}
        >
          Gerar relatório de hoje
        </KairosButton>
      </KairosCard>

      {latestReport ? (
        <KairosCard variant="gold" style={{ marginTop: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Sparkles color={colors.gold} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="label" color={colors.gold}>
                Último relatório
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                {formatDate(latestReport.createdAt)}
              </KairosText>
            </View>

            <KairosText variant="body" color={colors.gold} style={{ fontSize: 24, fontWeight: "900" }}>
              {latestReport.consistencyScore}
            </KairosText>
          </View>

          <KairosText variant="body" style={{ fontWeight: "900", marginTop: 16 }}>
            {latestReport.title}
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 8 }}>
            {latestReport.summary}
          </KairosText>

          <KairosButton
            variant="secondary"
            style={{ marginTop: 18 }}
            onPress={() => router.push("/ai/report")}
          >
            Ver relatório completo
          </KairosButton>
        </KairosCard>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Chat com IA
        </KairosText>

        <KairosText variant="subtitle">
          {messages.length} mensagens
        </KairosText>
      </View>

      <View style={{ gap: 12, marginTop: 14 }}>
        {messages.map((item) => {
          const isUser = item.role === "user";

          return (
            <KairosCard
              key={item.id}
              variant={isUser ? "gold" : "purple"}
              style={{
                borderRadius: 18,
                marginLeft: isUser ? 40 : 0,
                marginRight: isUser ? 0 : 40,
              }}
            >
              <KairosText variant="label" color={isUser ? colors.gold : colors.purple}>
                {isUser ? "Você" : "Kairos AI"}
              </KairosText>

              <KairosText variant="body" style={{ marginTop: 8 }}>
                {item.content}
              </KairosText>
            </KairosCard>
          );
        })}
      </View>

      <View style={{ marginTop: 18 }}>
        <KairosInput
          label="Pergunte para a Kairos AI"
          placeholder="Ex: por que meu peso travou?"
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 92, textAlignVertical: "top" }}
        />

        <KairosButton
          style={{ marginTop: 12 }}
          loading={isSendingMessage}
          onPress={handleSendMessage}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Send color={colors.background} size={18} />
            <KairosText variant="body" color={colors.background} style={{ fontWeight: "900" }}>
              Enviar
            </KairosText>
          </View>
        </KairosButton>

        <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={clearMessages}>
          Limpar conversa
        </KairosButton>
      </View>

      {reports.length > 1 ? (
        <>
          <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
            Histórico de relatórios
          </KairosText>

          <View style={{ gap: 12, marginTop: 14 }}>
            {reports.slice(1, 5).map((report) => (
              <KairosCard key={report.id} style={{ borderRadius: 18 }}>
                <KairosText variant="body" style={{ fontWeight: "900" }}>
                  {report.title}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {formatDate(report.createdAt)} • Score {report.consistencyScore}
                </KairosText>
              </KairosCard>
            ))}
          </View>
        </>
      ) : null}
    </KairosScreen>
  );
}