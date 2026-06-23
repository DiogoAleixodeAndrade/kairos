import { colors, radius } from "@/styles/theme";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, type ViewStyle } from "react-native";

type KairosButtonVariant = "primary" | "secondary" | "ghost";

type KairosButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: KairosButtonVariant;
  style?: ViewStyle;
};

export function KairosButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
}: KairosButtonProps) {
  const isDisabled = disabled || loading;

  const backgroundColor = {
    primary: colors.gold,
    secondary: colors.card,
    ghost: "transparent",
  }[variant];

  const textColor = {
    primary: colors.background,
    secondary: colors.white,
    ghost: colors.white,
  }[variant];

  const borderColor = {
    primary: colors.gold,
    secondary: colors.border,
    ghost: "transparent",
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: isDisabled ? "#8B7350" : backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: radius.lg,
          paddingVertical: 18,
          alignItems: "center",
          opacity: pressed ? 0.82 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>{children}</Text>
      )}
    </Pressable>
  );
}