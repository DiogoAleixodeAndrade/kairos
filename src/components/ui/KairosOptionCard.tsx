import { colors, radius } from "@/styles/theme";
import type { ReactNode } from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";

type KairosOptionCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function KairosOptionCard({
  title,
  description,
  icon,
  selected = false,
  onPress,
  style,
}: KairosOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: selected ? colors.gold : colors.border,
          padding: 20,
          opacity: pressed ? 0.84 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", gap: 14 }}>
        {icon ? <View>{icon}</View> : null}

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: "800" }}>{title}</Text>

          <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 }}>
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}