import { colors, radius } from "@/styles/theme";
import { Text, TextInput, type TextInputProps, View, type ViewStyle } from "react-native";

type KairosInputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function KairosInput({ label, error, style, containerStyle, ...props }: KairosInputProps) {
  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      {label ? (
        <Text style={{ color: colors.muted, fontSize: 13, fontWeight: "700", marginBottom: 8 }}>
          {label}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={colors.mutedDark}
        style={[
          {
            backgroundColor: colors.card,
            color: colors.white,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            padding: 18,
            fontSize: 16,
          },
          style,
        ]}
        {...props}
      />

      {error ? <Text style={{ color: colors.danger, marginTop: 6 }}>{error}</Text> : null}
    </View>
  );
}