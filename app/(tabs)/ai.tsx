import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useAIStore } from "@/stores/ai.store";
import { useGamificationStore } from "@/stores/gamification.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Brain, MessageCircle, Send, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AIScreen() {
  const reports = useAIStore((state) => state.reports);
  const messages = useAIStore((state) => state.messages);
  const isGeneratingReport = useAIStore((state) => state.isGeneratingReport);
  const isSendingMessage = useAIStore((state) => state.isSendingMessage);
  const generateReport = useAIStore((state) => state.generateReport);
  const sendMessage = useAIStore((state) => state.sendMessage);
  const clearMessages = useAIStore((state) => state.clearMessages);

  const awardAction = useGamificationStore((state) => state.awardAction);

  const [message, setMessage] = useState("");

  const latestReport = useMemo(() => {
    return reports[0] ?? null;
  }, [reports]);

  const recentReports = useMemo(() => {
    return reports.slice(0, 3);
  }, [reports]);

  async function handleGenerateReport() {
    try {
      await generateReport();
      awardAction("ai_report_generated");
      scheduleSafeAutoSync();

      Alert.alert("Relatório gerado", "A Kairos AI analisou seus dados e criou um novo relatório.");
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório agora.");
    }
  }

  async function handleSendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessage("");

    await sendMessage(trimmedMessage);
  }

  return (
    <KairosScreen>
      <KairosHeader
        title="Kairos AI"
        subtitle="Sua inteligência de evolução diária para alimentação, treino, sono e progresso."
      />

      <KairosCard variant="purple" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Brain color={colors.purple} size={28} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.purple}>
              Relatório diário
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              A Kairos cruza seus dados atuais e gera um plano de ação para hoje.
            </KairosText>
          </View>
        </View>

        <KairosButton
          style={{ marginTop: 18 }}
          loading={isGeneratingReport}
          onPress={handleGenerateReport}
        >
          {isGeneratingReport ? "Gerando análise..." : "Gerar relatório com IA"}
        </KairosButton>

        {latestReport ? (
          <KairosButton
            variant="secondary"
            style={{ marginTop: 10 }}
            onPress={() => router.push(`/ai/report?id=${latestReport.id}`)}
          >
            Ver último relatório
          </KairosButton>
        ) : null}
      </KairosCard>

      {latestReport ? (
        <Pressable
          onPress={() => router.push(`/ai/report?id=${latestReport.id}`)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.82 : 1,
          })}
        >
          <KairosCard variant="gold" style={{ marginTop: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Sparkles color={colors.gold} size={24} />

              <View style={{ flex: 1 }}>
                <KairosText variant="label" color={colors.gold}>
                  Último relatório
                </KairosText>

                <KairosText
                  variant="body"
                  style={{ fontSize: 22, fontWeight: "900", marginTop: 8 }}
                >
                  {latestReport.title}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 6 }}>
                  {latestReport.summary}
                </KairosText>

                <KairosText
                  variant="body"
                  color={colors.gold}
                  style={{ marginTop: 10, fontWeight: "900" }}
                >
                  Próxima ação: {latestReport.nextAction}
                </KairosText>
              </View>

              <View style={{ alignItems: "center" }}>
                <KairosText variant="metric">{latestReport.consistencyScore}</KairosText>
                <KairosText variant="subtitle">score</KairosText>
              </View>
            </View>
          </KairosCard>
        </Pressable>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Histórico
        </KairosText>

        <KairosText variant="subtitle">{reports.length} relatórios</KairosText>
      </View>

      <KairosButton
        variant="secondary"
        style={{ marginTop: 14 }}
        onPress={() => router.push("/ai/history")}
      >
        Abrir histórico de relatórios
      </KairosButton>

      {recentReports.length > 0 ? (
        <View style={{ gap: 12, marginTop: 14 }}>
          {recentReports.map((report) => (
            <Pressable
              key={report.id}
              onPress={() => router.push(`/ai/report?id=${report.id}`)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <KairosCard style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {report.title}
                    </KairosText>

                    <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                      {report.nextAction}
                    </KairosText>
                  </View>

                  <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                    {report.consistencyScore}
                  </KairosText>
                </View>
              </KairosCard>
            </Pressable>
          ))}
        </View>
      ) : null}

      <KairosText variant="label" color={colors.purple} style={{ marginTop: 28 }}>
        Chat Kairos
      </KairosText>

      <KairosCard style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MessageCircle color={colors.purple} size={22} />

          <View style={{ flex: 1 }}>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              Converse com a Kairos
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              Pergunte sobre peso, proteína, água, sono ou progresso.
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <View style={{ gap: 12, marginTop: 14 }}>
        {messages.map((item) => (
          <View
            key={item.id}
            style={{
              alignItems: item.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                maxWidth: "88%",
                borderRadius: 20,
                padding: 14,
                backgroundColor:
                  item.role === "user" ? "rgba(214,168,79,0.18)" : "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: item.role === "user" ? colors.borderGold : colors.border,
              }}
            >
              <KairosText
                variant="body"
                color={item.role === "user" ? colors.gold : colors.white}
                style={{ fontWeight: item.role === "user" ? "900" : "500" }}
              >
                {item.content}
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 6, fontSize: 11 }}>
                {formatTime(item.createdAt)}
              </KairosText>
            </View>
          </View>
        ))}
      </View>

      <View style={{ gap: 12, marginTop: 18 }}>
        <KairosInput
          label="Mensagem"
          placeholder="Ex: como está minha proteína hoje?"
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 90, textAlignVertical: "top" }}
        />

        <KairosButton loading={isSendingMessage} onPress={handleSendMessage}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Send color={colors.background} size={18} />

            <KairosText variant="body" color={colors.background} style={{ fontWeight: "900" }}>
              {isSendingMessage ? "Respondendo..." : "Enviar mensagem"}
            </KairosText>
          </View>
        </KairosButton>

        <KairosButton variant="ghost" onPress={clearMessages}>
          Limpar conversa
        </KairosButton>
      </View>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}
