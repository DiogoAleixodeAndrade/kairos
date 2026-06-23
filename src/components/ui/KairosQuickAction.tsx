import { colors, radius } from "@/styles/theme";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type KairosQuickActionProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
};

export function KairosQuickAction({ title, subtitle, icon, onPress }: KairosQuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      <View style={{ marginBottom: 14 }}>{icon}</View>

      <Text style={{ color: colors.white, fontSize: 15, fontWeight: "800" }}>{title}</Text>

      <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
        {subtitle}
      </Text>
    </Pressable>
  );
}