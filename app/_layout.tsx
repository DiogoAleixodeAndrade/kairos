import "@/styles/global.css";

import { useAuthSession } from "@/features/auth/useAuthSession";
import { usePendingSyncFlush } from "@/features/sync/pending-sync.watcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  useAuthSession();
  usePendingSyncFlush();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}