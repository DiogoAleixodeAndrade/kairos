import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useAIStore } from "@/stores/ai.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Brain, CalendarDays, Sparkles } from "lucide-react-native";
import { Pressable, View } from "react-native";

function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AIHistoryScreen() {
  const reports = useAIStore((state) => state.reports);

  return (
    <KairosScreen>
      <KairosHeader
        title="Histórico da IA"
        subtitle="Veja todos os relatórios gerados pela Kairos AI ao longo da sua jornada."
      />

      <KairosCard variant="purple" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Brain color={colors.purple} size={26} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.purple}>
              Relatórios salvos
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 12 }}>
              {reports.length}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              análises geradas pela Kairos AI
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Relatórios
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {reports.length === 0 ? (
          <KairosCard>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              Nenhum relatório gerado ainda.
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              Volte para a aba Kairos AI e gere seu primeiro relatório diário.
            </KairosText>
          </KairosCard>
        ) : (
          reports.map((report) => (
            <Pressable
              key={report.id}
              onPress={() => router.push(`/ai/report?id=${report.id}`)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <KairosCard style={{ borderRadius: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(214,168,79,0.12)",
                      borderWidth: 1,
                      borderColor: colors.borderGold,
                    }}
                  >
                    <Sparkles color={colors.gold} size={22} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {report.title}
                    </KairosText>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      <CalendarDays color={colors.muted} size={14} />

                      <KairosText variant="subtitle">{formatDate(report.createdAt)}</KairosText>
                    </View>

                    <KairosText variant="subtitle" style={{ marginTop: 8 }}>
                      {report.nextAction}
                    </KairosText>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                      {report.consistencyScore}
                    </KairosText>

                    <KairosText variant="subtitle">score</KairosText>
                  </View>
                </View>
              </KairosCard>
            </Pressable>
          ))
        )}
      </View>

      <KairosButton variant="secondary" style={{ marginTop: 28 }} onPress={() => router.back()}>
        Voltar
      </KairosButton>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}
