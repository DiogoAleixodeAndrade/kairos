import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

type KairosMacroCardProps = {
  label: string;
  current: number;
  target: number;
  unit: string;
  color?: string;
};

export function KairosMacroCard({
  label,
  current,
  target,
  unit,
  color = colors.gold,
}: KairosMacroCardProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <KairosText variant="body" style={{ fontSize: 14, fontWeight: "800" }}>
          {label}
        </KairosText>

        <KairosText variant="subtitle" style={{ fontSize: 13 }}>
          {percentage}%
        </KairosText>
      </View>

      <KairosProgressBar value={current} max={target} color={color} />

      <KairosText variant="subtitle" style={{ fontSize: 13, marginTop: 6 }}>
        {current}
        {unit} / {target}
        {unit}
      </KairosText>
    </View>
  );
}