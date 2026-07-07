import { useSyncStore } from "@/stores/sync.store";
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

const RETRY_INTERVAL_MS = 60_000; // tenta reenviar pendências a cada 60s

/**
 * Observa o ciclo de vida do app e reenvia sync pendente:
 * - quando o app volta ao primeiro plano (provável reconexão)
 * - periodicamente enquanto houver pendência
 * - uma vez ao montar (caso o app tenha aberto com pendência salva)
 */
export function usePendingSyncFlush() {
  useEffect(() => {
    const flush = () => {
      void useSyncStore.getState().flushPendingSync();
    };

    // tenta assim que o app abre
    flush();

    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (nextState === "active") {
        flush();
      }
    });

    const interval = setInterval(() => {
      if (useSyncStore.getState().hasPendingSync) {
        flush();
      }
    }, RETRY_INTERVAL_MS);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);
}
