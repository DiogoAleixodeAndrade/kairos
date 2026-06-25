import { KairosCard } from "@/components/ui/KairosCard";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosText } from "@/components/ui/KairosText";
import {
  journeyHistorySchema,
  type JourneyHistoryFormData,
} from "@/features/onboarding/onboarding.schema";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useProgressStore } from "@/stores/progress.store";
import { useProfileStore } from "@/stores/profile.store";
import { calculateNutritionTargets } from "@/features/nutrition/nutrition-goals.service";
import { useNutritionStore } from "@/stores/nutrition.store";

export default function OnboardingHistoryScreen() {
  const onboarding = useOnboardingStore();
  const completeOnboarding = useProfileStore(
    (state) => state.completeOnboarding,
  );
  const setJourneyWeights = useProgressStore(
    (state) => state.setJourneyWeights,
  );
  const setTargets = useNutritionStore((state) => state.setTargets);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JourneyHistoryFormData>({
    resolver: zodResolver(journeyHistorySchema),
    defaultValues: {
      journeyStartDate: onboarding.journeyStartDate,
      journeyStartWeightKg: onboarding.journeyStartWeightKg,
      targetWeightKg: onboarding.targetWeightKg,
    },
  });

  const startWeight = Number(watch("journeyStartWeightKg") || 0);
  const currentWeight = Number(onboarding.currentWeightKg || 0);
  const targetWeight = Number(watch("targetWeightKg") || 0);

  const lostWeight =
    startWeight > currentWeight ? startWeight - currentWeight : 0;
  const totalGoal = startWeight > targetWeight ? startWeight - targetWeight : 0;
  const progress =
    totalGoal > 0 ? Math.round((lostWeight / totalGoal) * 100) : 0;

  function toNumber(value: string) {
    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    return Number.isFinite(number) ? number : 0;
  }

  function onSubmit(data: JourneyHistoryFormData) {
    onboarding.setJourneyHistory(data);

    const currentWeightKg = toNumber(onboarding.currentWeightKg);

    setJourneyWeights({
      startWeightKg: toNumber(data.journeyStartWeightKg),
      currentWeightKg,
      targetWeightKg: toNumber(data.targetWeightKg),
    });

    const targets = calculateNutritionTargets({
      age: toNumber(onboarding.age),
      heightCm: toNumber(onboarding.heightCm),
      currentWeightKg,
      objective: onboarding.objective,
      activityLevel: onboarding.activityLevel,
    });

    setTargets(targets);

    completeOnboarding();

    router.replace("/(tabs)/home");
  }

  return (
    <KairosScreen>
      <KairosLogo />

      <KairosText variant="label" style={{ marginTop: 32 }}>
        Etapa 3 de 4
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Registre sua história.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Seu progresso não começa hoje se você já vem lutando antes. O Kairos vai
        considerar toda sua caminhada.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <Controller
          control={control}
          name="journeyStartDate"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Data de início"
              placeholder="Ex: 01/12/2024"
              value={value}
              onChangeText={onChange}
              error={errors.journeyStartDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="journeyStartWeightKg"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Peso inicial"
              placeholder="Ex: 185"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.journeyStartWeightKg?.message}
            />
          )}
        />

        <KairosInput
          label="Peso atual"
          value={
            onboarding.currentWeightKg ? `${onboarding.currentWeightKg} kg` : ""
          }
          editable={false}
        />

        <Controller
          control={control}
          name="targetWeightKg"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Peso alvo"
              placeholder="Ex: 120"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.targetWeightKg?.message}
            />
          )}
        />
      </View>

      {lostWeight > 0 ? (
        <KairosCard variant="gold" style={{ marginTop: 20 }}>
          <KairosText variant="label" color={colors.gold}>
            Sua jornada até aqui
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            -{lostWeight.toFixed(1)} kg
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Você já completou aproximadamente {progress}% do caminho até sua
            meta.
          </KairosText>
        </KairosCard>
      ) : null}

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Gerar meu plano
      </KairosButton>
    </KairosScreen>
  );
}
