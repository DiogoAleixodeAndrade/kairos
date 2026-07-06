import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import {
  computeSessionVolume,
  countCompletedSets,
} from "@/features/training/training-analytics.service";
import { useTrainingStore } from "@/stores/training.store";
import { colors } from "@/styles/theme";
import { Clock, Dumbbell, Flame, Trash2 } from "lucide-react-native";
import { useMemo } from "react";
import { Alert, Pressable, View } from "react-native";

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WorkoutHistoryScreen() {
  const sessions = useTrainingStore((state) => state.sessions);
  const removeSession = useTrainingStore((state) => state.removeSession);

  const orderedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }, [sessions]);

  function confirmRemove(sessionId: string, title: string) {
    Alert.alert("Excluir treino", `Remover o registro de "${title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removeSession(sessionId),
      },
    ]);
  }

  return (
    <KairosScreen>
      <KairosHeader title="Histórico" subtitle="Cada treino registrado é evolução." />

      {orderedSessions.length === 0 ? (
        <KairosCard style={{ marginTop: 28 }}>
          <KairosText variant="body" style={{ fontWeight: "900" }}>
            Nenhum treino registrado ainda.
          </KairosText>
          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Finalize um treino para começar a construir seu histórico.
          </KairosText>
        </KairosCard>
      ) : (
        <View style={{ gap: 12, marginTop: 24 }}>
          {orderedSessions.map((session) => {
            const volume = computeSessionVolume(session);
            const completedSets = countCompletedSets(session);

            return (
              <KairosCard key={session.id} style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <Dumbbell color={colors.purple} size={22} />
                    <View style={{ flex: 1 }}>
                      <KairosText variant="body" style={{ fontWeight: "900" }}>
                        {session.title}
                      </KairosText>
                      <KairosText variant="subtitle" style={{ marginTop: 2 }}>
                        {formatDate(session.startedAt)}
                      </KairosText>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => confirmRemove(session.id, session.title)}
                    style={{ padding: 4 }}
                  >
                    <Trash2 color={colors.mutedDark} size={18} />
                  </Pressable>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginTop: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Clock color={colors.blue} size={14} />
                      <KairosText variant="subtitle">Duração</KairosText>
                    </View>
                    <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                      {session.durationMinutes ?? 0} min
                    </KairosText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <KairosText variant="subtitle">Volume</KairosText>
                    <KairosText
                      variant="body"
                      color={colors.gold}
                      style={{ fontWeight: "900", marginTop: 2 }}
                    >
                      {Math.round(volume).toLocaleString("pt-BR")} kg
                    </KairosText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Flame color={colors.gold} size={14} />
                      <KairosText variant="subtitle">Kcal</KairosText>
                    </View>
                    <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                      {session.estimatedCalories ?? 0}
                    </KairosText>
                  </View>
                </View>

                <KairosText variant="subtitle" style={{ marginTop: 14 }}>
                  {completedSets} séries concluídas
                </KairosText>
              </KairosCard>
            );
          })}
        </View>
      )}
    </KairosScreen>
  );
}
