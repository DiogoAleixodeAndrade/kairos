import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { loginSchema, type LoginFormData } from "@/features/auth/auth.schema";
import { signInWithEmail } from "@/features/auth/auth.service";
import { colors } from "@/styles/theme";
import { toast } from "@/stores/toast.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { useProfileStore } from "@/stores/profile.store";

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setDemoMode = useProfileStore((state) => state.setDemoMode);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setIsSubmitting(true);

      await signInWithEmail(data);
      setDemoMode(false);
      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message === "Email not confirmed"
            ? "E-mail ainda não confirmado. Confirme seu e-mail para entrar."
            : error.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : error.message
          : "Confira seus dados e tente novamente.";

      toast.error(message, "Erro ao entrar");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSoft, colors.background]}
      style={{ flex: 1, padding: 24, justifyContent: "center" }}
    >
      <KairosLogo />

      <KairosText variant="title" style={{ marginTop: 28 }}>
        Entrar
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 8 }}>
        Continue sua evolução no tempo certo.
      </KairosText>

      <View style={{ gap: 14, marginTop: 32 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Senha"
              placeholder="Digite sua senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />
      </View>

      <KairosButton
        loading={isSubmitting}
        style={{ marginTop: 28 }}
        onPress={handleSubmit(onSubmit)}
      >
        Entrar
      </KairosButton>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={{ color: colors.white, textAlign: "center", marginTop: 18 }}>
          Criar conta
        </Text>
      </Pressable>
    </LinearGradient>
  );
}