import { colors, radius } from "@/styles/theme";
import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

type KairosCardVariant = "default" | "gold" | "purple" | "blue";

type KairosCardProps = {
  children: ReactNode;
  variant?: KairosCardVariant;
  style?: ViewStyle;
};

export function KairosCard({ children, variant = "default", style }: KairosCardProps) {
  const borderColor = {
    default: colors.border,
    gold: colors.borderGold,
    purple: colors.borderPurple,
    blue: "rgba(76,201,240,0.35)",
  }[variant];

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor,
          padding: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}