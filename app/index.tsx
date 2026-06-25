import { KairosLoadingScreen } from "@/components/layout/KairosLoadingScreen";
import { useAuthStore } from "@/stores/auth.store";
import { useProfileStore } from "@/stores/profile.store";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isDemoMode = useProfileStore((state) => state.isDemoMode);
  const hasCompletedOnboarding = useProfileStore((state) => state.hasCompletedOnboarding);

  if (isLoading) {
    return <KairosLoadingScreen />;
  }

  if (isDemoMode) {
    if (hasCompletedOnboarding) {
      return <Redirect href="/(tabs)/home" />;
    }

    return <Redirect href="/(onboarding)/journey" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/journey" />;
  }

  return <Redirect href="/(tabs)/home" />;
}