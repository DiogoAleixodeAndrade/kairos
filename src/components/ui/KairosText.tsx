import { colors } from "@/styles/theme";
import type { ReactNode } from "react";
import { Text, type TextStyle } from "react-native";

type KairosTextVariant = "title" | "subtitle" | "label" | "body" | "metric";

type KairosTextProps = {
  children: ReactNode;
  variant?: KairosTextVariant;
  color?: string;
  style?: TextStyle;
};

export function KairosText({ children, variant = "body", color, style }: KairosTextProps) {
  const variants: Record<KairosTextVariant, TextStyle> = {
    title: {
      color: colors.white,
      fontSize: 42,
      fontWeight: "800",
      lineHeight: 48,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 16,
      lineHeight: 24,
    },
    label: {
      color: colors.gold,
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    body: {
      color: colors.white,
      fontSize: 16,
      lineHeight: 24,
    },
    metric: {
      color: colors.white,
      fontSize: 42,
      fontWeight: "800",
    },
  };

  return <Text style={[variants[variant], color ? { color } : null, style]}>{children}</Text>;
}