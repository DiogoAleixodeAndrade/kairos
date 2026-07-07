import { useToastStore, type Toast } from "@/stores/toast.store";
import { colors, radius } from "@/styles/theme";
import { CheckCircle2, Info, XCircle } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DURATION_MS = 3500;

const TYPE_CONFIG = {
  success: { color: colors.success, Icon: CheckCircle2 },
  error: { color: colors.danger, Icon: XCircle },
  info: { color: colors.blue, Icon: Info },
} as const;

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  const config = TYPE_CONFIG[toast.type];
  const Icon = config.Icon;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => dismiss(toast.id));
    }, DURATION_MS);

    return () => clearTimeout(timeout);
  }, [dismiss, opacity, toast.id, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        onPress={() => dismiss(toast.id)}
        style={[styles.toast, { borderColor: config.color }]}
      >
        <Icon color={config.color} size={22} />

        <View style={{ flex: 1 }}>
          {toast.title ? <Text style={styles.title}>{toast.title}</Text> : null}
          <Text style={styles.message}>{toast.message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function KairosToaster() {
  const toasts = useToastStore((state) => state.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.container, { top: insets.top + 12 }]}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    gap: 10,
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 2,
  },
  message: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
