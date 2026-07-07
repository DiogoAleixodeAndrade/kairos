import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  restoreLocalDataFromSupabase,
  syncLocalDataToSupabase,
} from "@/features/sync/sync.service";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SyncState = {
  isSyncing: boolean;
  isRestoring: boolean;
  lastSyncedAt: string | null;
  hasPendingSync: boolean;
  error: string | null;

  syncNow: () => Promise<void>;
  restoreNow: () => Promise<void>;
  flushPendingSync: () => Promise<void>;
  markPendingSync: () => void;
  clearSyncError: () => void;
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      isSyncing: false,
      isRestoring: false,
      lastSyncedAt: null,
      hasPendingSync: false,
      error: null,

      syncNow: async () => {
        set({ isSyncing: true, error: null });

        try {
          const result = await syncLocalDataToSupabase();

          set({
            lastSyncedAt: result.syncedAt,
            hasPendingSync: false,
          });
        } catch (error) {
          // falhou (provavelmente offline): marca como pendente para tentar depois
          set({
            error: error instanceof Error ? error.message : "Erro ao sincronizar.",
            hasPendingSync: true,
          });

          throw error;
        } finally {
          set({ isSyncing: false });
        }
      },

      restoreNow: async () => {
        set({ isRestoring: true, error: null });

        try {
          const result = await restoreLocalDataFromSupabase();

          set({ lastSyncedAt: result.syncedAt });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Erro ao restaurar backup.",
          });

          throw error;
        } finally {
          set({ isRestoring: false });
        }
      },

      // marca que há alterações locais ainda não enviadas
      markPendingSync: () => {
        set({ hasPendingSync: true });
      },

      // tenta enviar o que está pendente; silencioso (usado por watchers)
      flushPendingSync: async () => {
        const state = get();
        const auth = useAuthStore.getState();
        const profile = useProfileStore.getState();

        if (!state.hasPendingSync) return;
        if (state.isSyncing) return;
        if (!auth.isAuthenticated) return;
        if (profile.isDemoMode) return;

        try {
          await get().syncNow();
        } catch {
          // continua pendente; o watcher tenta de novo mais tarde
        }
      },

      clearSyncError: () => {
        set({ error: null });
      },
    }),
    {
      name: "kairos-sync-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastSyncedAt: state.lastSyncedAt,
        hasPendingSync: state.hasPendingSync,
      }),
    }
  )
);