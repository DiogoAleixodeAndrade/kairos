import { colors } from "@/styles/theme";
import { Text } from "react-native";

type KairosLogoProps = {
  size?: "sm" | "md" | "lg";
};

export function KairosLogo({ size = "md" }: KairosLogoProps) {
  const fontSize = {
    sm: 16,
    md: 20,
    lg: 28,
  }[size];

  return (
    <Text
      style={{
        color: colors.gold,
        fontSize,
        fontWeight: "800",
        letterSpacing: 5,
      }}
    >
      KAIROS
    </Text>
  );
}