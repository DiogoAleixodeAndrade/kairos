import {
  restoreLocalDataFromSupabase,
  syncLocalDataToSupabase,
} from "@/features/sync/sync.service";
import { create } from "zustand";

type SyncState = {
  isSyncing: boolean;
  isRestoring: boolean;
  lastSyncedAt: string | null;
  error: string | null;

  syncNow: () => Promise<void>;
  restoreNow: () => Promise<void>;
  clearSyncError: () => void;
};

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  isRestoring: false,
  lastSyncedAt: null,
  error: null,

  syncNow: async () => {
    set({
      isSyncing: true,
      error: null,
    });

    try {
      const result = await syncLocalDataToSupabase();

      set({
        lastSyncedAt: result.syncedAt,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao sincronizar.",
      });

      throw error;
    } finally {
      set({
        isSyncing: false,
      });
    }
  },

  restoreNow: async () => {
    set({
      isRestoring: true,
      error: null,
    });

    try {
      const result = await restoreLocalDataFromSupabase();

      set({
        lastSyncedAt: result.syncedAt,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao restaurar backup.",
      });

      throw error;
    } finally {
      set({
        isRestoring: false,
      });
    }
  },

  clearSyncError: () => {
    set({
      error: null,
    });
  },
}));