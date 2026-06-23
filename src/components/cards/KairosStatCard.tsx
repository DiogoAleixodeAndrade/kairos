import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View, type ViewStyle } from "react-native";

type KairosStatCardProps = {
  label: string;
  value: string;
  description?: string;
  accent?: "gold" | "purple" | "blue";
  style?: ViewStyle;
};

export function KairosStatCard({
  label,
  value,
  description,
  accent = "gold",
  style,
}: KairosStatCardProps) {
  const accentColor = {
    gold: colors.gold,
    purple: colors.purple,
    blue: colors.blue,
  }[accent];

  return (
    <KairosCard style={style}>
      <View>
        <KairosText variant="label" color={accentColor}>
          {label}
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 12 }}>
          {value}
        </KairosText>

        {description ? (
          <KairosText variant="subtitle" style={{ marginTop: 2 }}>
            {description}
          </KairosText>
        ) : null}
      </View>
    </KairosCard>
  );
}