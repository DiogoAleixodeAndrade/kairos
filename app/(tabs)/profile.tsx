import { KairosAchievementCard } from "@/components/cards/KairosAchievementCard";
import { KairosLevelCard } from "@/components/cards/KairosLevelCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { useGamificationStore } from "@/stores/gamification.store";
import { colors } from "@/styles/theme";
import { Alert, View } from "react-native";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function ProfileScreen() {
  const levelInfo = useGamificationStore((state) => state.getLevelInfo());
  const unlockedAchievements = useGamificationStore((state) => state.getUnlockedAchievements());
  const lockedAchievements = useGamificationStore((state) => state.getLockedAchievements());
  const recentXPLogs = useGamificationStore((state) => state.getRecentXPLogs());
  const resetGamification = useGamificationStore((state) => state.resetGamification);

  function handleReset() {
    Alert.alert(
      "Reiniciar gamificação",
      "Isso vai zerar XP, nível e conquistas neste ambiente de teste.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Zerar",
          style: "destructive",
          onPress: resetGamification,
        },
      ]
    );
  }

  return (
    <KairosScreen>
      <KairosHeader
        title="Perfil"
        subtitle="Sua jornada, nível, XP e conquistas dentro do Kairos."
      />

      <View style={{ marginTop: 28 }}>
        <KairosLevelCard {...levelInfo} />
      </View>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.gold}>
            Conquistas
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {unlockedAchievements.length}
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            desbloqueadas
          </KairosText>
        </KairosCard>

        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.purple}>
            Bloqueadas
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {lockedAchievements.length}
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            para conquistar
          </KairosText>
        </KairosCard>
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Conquistas desbloqueadas
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {unlockedAchievements.length === 0 ? (
          <KairosCard>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              Nenhuma conquista desbloqueada ainda.
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              Registre uma refeição, água, treino, sono ou progresso para começar a ganhar XP.
            </KairosText>
          </KairosCard>
        ) : (
          unlockedAchievements.map((achievement) => (
            <KairosAchievementCard key={achievement.id} achievement={achievement} />
          ))
        )}
      </View>

      <KairosText variant="label" color={colors.purple} style={{ marginTop: 28 }}>
        Próximas conquistas
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {lockedAchievements.slice(0, 6).map((achievement) => (
          <KairosAchievementCard key={achievement.id} achievement={achievement} locked />
        ))}
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Histórico de XP
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {recentXPLogs.length === 0 ? (
          <KairosCard>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              Nenhum XP recebido ainda.
            </KairosText>
          </KairosCard>
        ) : (
          recentXPLogs.map((log) => (
            <KairosCard key={log.id} style={{ borderRadius: 18 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <KairosText variant="body" style={{ fontWeight: "900" }}>
                    {log.reason}
                  </KairosText>

                  <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                    {formatDate(log.createdAt)}
                  </KairosText>
                </View>

                <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                  +{log.amount} XP
                </KairosText>
              </View>
            </KairosCard>
          ))
        )}
      </View>

      <KairosButton variant="ghost" style={{ marginTop: 28 }} onPress={handleReset}>
        Zerar gamificação demo
      </KairosButton>
    </KairosScreen>
  );
}