import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosText } from "@/components/ui/KairosText";
import {
  physicalDataSchema,
  type PhysicalDataFormData,
} from "@/features/onboarding/onboarding.schema";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useProfileStore } from "@/stores/profile.store";
import { useProgressStore } from "@/stores/progress.store";

export default function OnboardingStepOneScreen() {
  const onboarding = useOnboardingStore();
  const setDisplayName = useProfileStore((state) => state.setDisplayName);
  const completeOnboarding = useProfileStore(
    (state) => state.completeOnboarding,
  );
  const setJourneyWeights = useProgressStore(
    (state) => state.setJourneyWeights,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhysicalDataFormData>({
    resolver: zodResolver(physicalDataSchema),
    defaultValues: {
      name: onboarding.name,
      age: onboarding.age,
      currentWeightKg: onboarding.currentWeightKg,
      heightCm: onboarding.heightCm,
    },
  });

  function toNumber(value: string) {
    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    return Number.isFinite(number) ? number : 0;
  }

  function onSubmit(data: PhysicalDataFormData) {
    onboarding.setPhysicalData(data);
    setDisplayName(data.name);

    if (onboarding.journeyMode === "with_history") {
      router.push("/(onboarding)/history");
      return;
    }

    const currentWeightKg = toNumber(data.currentWeightKg);

    setJourneyWeights({
      startWeightKg: currentWeightKg,
      currentWeightKg,
      targetWeightKg: currentWeightKg,
    });

    completeOnboarding();

    router.replace("/(tabs)/home");
  }
  return (
    <KairosScreen>
      <KairosLogo />

      <KairosText variant="label" style={{ marginTop: 32 }}>
        Etapa 2 de 4
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Seu ponto de partida.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Esses dados ajudam a Kairos AI a calcular suas metas iniciais.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Nome"
              placeholder="Ex: Diogo"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Idade"
              placeholder="Ex: 25"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.age?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="currentWeightKg"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Peso atual"
              placeholder="Ex: 145"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.currentWeightKg?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="heightCm"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Altura"
              placeholder="Ex: 180"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.heightCm?.message}
            />
          )}
        />
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Continuar
      </KairosButton>
    </KairosScreen>
  );
}
