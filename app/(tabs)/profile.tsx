import { KairosAchievementCard } from "@/components/cards/KairosAchievementCard";
import { KairosLevelCard } from "@/components/cards/KairosLevelCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { signOut } from "@/features/auth/auth.service";
import {
  ACHIEVEMENTS,
  getLevelInfo as getGamificationLevelInfo,
} from "@/features/gamification/gamification.config";
import { useGamificationStore } from "@/stores/gamification.store";
import { useSyncStore } from "@/stores/sync.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { useMemo } from "react";
import { Alert, View } from "react-native";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}

export default function ProfileScreen() {
  const totalXp = useGamificationStore((state) => state.totalXp);
  const xpLogs = useGamificationStore((state) => state.xpLogs);
  const unlockedAchievements = useGamificationStore((state) => state.unlockedAchievements);
  const resetGamification = useGamificationStore((state) => state.resetGamification);

  const isSyncing = useSyncStore((state) => state.isSyncing);
  const isRestoring = useSyncStore((state) => state.isRestoring);
  const lastSyncedAt = useSyncStore((state) => state.lastSyncedAt);
  const syncNow = useSyncStore((state) => state.syncNow);
  const restoreNow = useSyncStore((state) => state.restoreNow);

  const levelInfo = useMemo(() => {
    return getGamificationLevelInfo(totalXp);
  }, [totalXp]);

  const lockedAchievements = useMemo(() => {
    const unlockedIds = new Set(unlockedAchievements.map((achievement) => achievement.id));

    return ACHIEVEMENTS.filter((achievement) => !unlockedIds.has(achievement.id));
  }, [unlockedAchievements]);

  const recentXPLogs = useMemo(() => {
    return xpLogs.slice(0, 8);
  }, [xpLogs]);

  async function handleSyncNow() {
    try {
      await syncNow();

      Alert.alert("Sincronizado", "Seus dados foram salvos no Supabase.");
    } catch (error) {
      Alert.alert(
        "Erro ao sincronizar",
        error instanceof Error ? error.message : "Não foi possível sincronizar."
      );
    }
  }

  function handleRestoreNow() {
    Alert.alert(
      "Restaurar backup",
      "Isso vai substituir os dados locais pelos dados salvos no Supabase.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: async () => {
            try {
              await restoreNow();

              Alert.alert("Backup restaurado", "Os dados do Supabase foram carregados no app.");
            } catch (error) {
              Alert.alert(
                "Erro ao restaurar",
                error instanceof Error ? error.message : "Não foi possível restaurar o backup."
              );
            }
          },
        },
      ]
    );
  }

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

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/(auth)/welcome");
    } catch {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
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

      <KairosCard variant="blue" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.blue}>
          Sincronização Supabase
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 8 }}>
          Salve e restaure seus dados reais na nuvem. Funciona apenas com usuário logado.
        </KairosText>

        {lastSyncedAt ? (
          <KairosText variant="body" color={colors.blue} style={{ marginTop: 10, fontWeight: "900" }}>
            Última sincronização: {formatDateTime(lastSyncedAt)}
          </KairosText>
        ) : (
          <KairosText variant="body" color={colors.blue} style={{ marginTop: 10, fontWeight: "900" }}>
            Nenhuma sincronização feita ainda.
          </KairosText>
        )}

        <KairosButton style={{ marginTop: 16 }} loading={isSyncing} onPress={handleSyncNow}>
          Salvar no Supabase
        </KairosButton>

        <KairosButton
          variant="secondary"
          style={{ marginTop: 10 }}
          loading={isRestoring}
          onPress={handleRestoreNow}
        >
          Restaurar do Supabase
        </KairosButton>
      </KairosCard>

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

      <KairosButton variant="secondary" style={{ marginTop: 28 }} onPress={handleSignOut}>
        Sair da conta
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={handleReset}>
        Zerar gamificação demo
      </KairosButton>
    </KairosScreen>
  );
}