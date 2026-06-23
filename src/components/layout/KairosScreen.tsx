import { colors } from "@/styles/theme";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

type KairosScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function KairosScreen({ children, scroll = true }: KairosScreenProps) {
  if (!scroll) {
    return (
      <LinearGradient colors={[colors.background, colors.backgroundSoft, colors.background]} style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 24, paddingTop: 70 }}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSoft, colors.background]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 70, paddingBottom: 120 }}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
}