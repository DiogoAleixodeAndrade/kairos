import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import { registerSchema, type RegisterFormData } from "@/features/auth/auth.schema";
import { signUpWithEmail } from "@/features/auth/auth.service";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";

export default function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      setIsSubmitting(true);
      await signUpWithEmail(data);

      Alert.alert("Conta criada", "Sua conta foi criada. Agora faça login para continuar.");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(
        "Erro ao criar conta",
        error instanceof Error ? error.message : "Tente novamente."
      );
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
        Criar conta
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 8 }}>
        Comece sua jornada no tempo certo.
      </KairosText>

      <View style={{ gap: 14, marginTop: 32 }}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Nome completo"
              placeholder="Digite seu nome"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

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
              placeholder="Crie uma senha"
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
        Criar minha conta
      </KairosButton>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={{ color: colors.white, textAlign: "center", marginTop: 18 }}>
          Já tenho conta
        </Text>
      </Pressable>
    </LinearGradient>
  );
}