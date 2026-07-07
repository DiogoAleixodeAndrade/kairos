import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { useSyncStore } from "@/stores/sync.store";

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export function scheduleSafeAutoSync() {
  const auth = useAuthStore.getState();
  const profile = useProfileStore.getState();

  if (!auth.isAuthenticated) {
    return;
  }

  if (profile.isDemoMode) {
    return;
  }

  // marca imediatamente como pendente; se o envio der certo, o flag é limpo
  useSyncStore.getState().markPendingSync();

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    try {
      await useSyncStore.getState().syncNow();
    } catch (error) {
      // offline ou falha: permanece pendente e será reenviado depois
      console.warn(
        "Auto sync falhou (ficará pendente):",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }, 1200);
}