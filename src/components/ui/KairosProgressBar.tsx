import { colors, radius } from "@/styles/theme";
import { View, type ViewStyle } from "react-native";

type KairosProgressBarProps = {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
};

export function KairosProgressBar({
  value,
  max = 100,
  color = colors.gold,
  height = 8,
  style,
}: KairosProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <View
      style={[
        {
          width: "100%",
          height,
          borderRadius: radius.full,
          backgroundColor: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${percentage}%`,
          height: "100%",
          borderRadius: radius.full,
          backgroundColor: color,
        }}
      />
    </View>
  );
}