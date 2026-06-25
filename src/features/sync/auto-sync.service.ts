import { syncLocalDataToSupabase } from "@/features/sync/sync.service";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";

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

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    try {
      await syncLocalDataToSupabase();
    } catch (error) {
      console.warn(
        "Auto sync falhou:",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }, 1200);
}