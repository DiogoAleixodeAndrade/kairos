import { KairosLoadingScreen } from "@/components/layout/KairosLoadingScreen";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return <KairosLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}