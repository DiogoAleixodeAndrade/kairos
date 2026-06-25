import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosLogo } from "@/components/ui/KairosLogo";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import {
  calculateNutritionTargets,
  type ActivityLevel,
  type NutritionObjective,
} from "@/features/nutrition/nutrition-goals.service";
import {
  physicalDataSchema,
  type PhysicalDataFormData,
} from "@/features/onboarding/onboarding.schema";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { useProfileStore } from "@/stores/profile.store";
import { useProgressStore } from "@/stores/progress.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

const objectiveOptions: {
  value: NutritionObjective;
  title: string;
  description: string;
}[] = [
  {
    value: "cut",
    title: "Emagrecer",
    description:
      "Déficit calórico com proteína alta para preservar massa magra.",
  },
  {
    value: "maintain",
    title: "Manter",
    description: "Calorias próximas do gasto diário para estabilidade.",
  },
  {
    value: "gain",
    title: "Ganhar massa",
    description: "Superávit controlado para evoluir com qualidade.",
  },
];

const activityOptions: {
  value: ActivityLevel;
  title: string;
  description: string;
}[] = [
  {
    value: "sedentary",
    title: "Sedentário",
    description: "Pouco movimento e sem treino frequente.",
  },
  {
    value: "light",
    title: "Leve",
    description: "Treina ou caminha poucas vezes na semana.",
  },
  {
    value: "moderate",
    title: "Moderado",
    description: "Treina de 3 a 5 vezes por semana.",
  },
  {
    value: "high",
    title: "Alto",
    description: "Treina forte quase todos os dias.",
  },
  {
    value: "athlete",
    title: "Atleta",
    description: "Rotina intensa, alto gasto e treinos frequentes.",
  },
];

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function getDefaultTargetWeight(
  currentWeightKg: number,
  objective: NutritionObjective,
) {
  if (objective === "cut") {
    return Math.max(40, currentWeightKg * 0.9);
  }

  if (objective === "gain") {
    return currentWeightKg * 1.05;
  }

  return currentWeightKg;
}

export default function OnboardingStepOneScreen() {
  const onboarding = useOnboardingStore();

  const setDisplayName = useProfileStore((state) => state.setDisplayName);
  const setNutritionProfile = useProfileStore(
    (state) => state.setNutritionProfile,
  );
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
    setValue,
    formState: { errors },
  } = useForm<PhysicalDataFormData>({
    resolver: zodResolver(physicalDataSchema),
    defaultValues: {
      name: onboarding.name,
      age: onboarding.age,
      currentWeightKg: onboarding.currentWeightKg,
      heightCm: onboarding.heightCm,
      objective: onboarding.objective,
      activityLevel: onboarding.activityLevel,
    },
  });

  const selectedObjective = watch("objective");
  const selectedActivityLevel = watch("activityLevel");

  function onSubmit(data: PhysicalDataFormData) {
    onboarding.setPhysicalData(data);
    setDisplayName(data.name);

    setNutritionProfile({
      age: toNumber(data.age),
      heightCm: toNumber(data.heightCm),
      objective: data.objective,
      activityLevel: data.activityLevel,
    });

    const currentWeightKg = toNumber(data.currentWeightKg);

    const targets = calculateNutritionTargets({
      age: toNumber(data.age),
      heightCm: toNumber(data.heightCm),
      currentWeightKg,
      objective: data.objective,
      activityLevel: data.activityLevel,
    });

    setTargets(targets);

    if (onboarding.journeyMode === "with_history") {
      router.push("/(onboarding)/history");
      return;
    }

    const targetWeightKg = getDefaultTargetWeight(
      currentWeightKg,
      data.objective,
    );

    setJourneyWeights({
      startWeightKg: currentWeightKg,
      currentWeightKg,
      targetWeightKg,
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
        Esses dados ajudam a Kairos AI a calcular suas metas iniciais de
        calorias, macros e água.
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

      <KairosText variant="label" style={{ marginTop: 28 }}>
        Objetivo
      </KairosText>

      <View style={{ gap: 10, marginTop: 14 }}>
        {objectiveOptions.map((option) => (
          <KairosOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selectedObjective === option.value}
            onPress={() => setValue("objective", option.value)}
          />
        ))}
      </View>

      <KairosText variant="label" style={{ marginTop: 28 }}>
        Nível de atividade
      </KairosText>

      <View style={{ gap: 10, marginTop: 14 }}>
        {activityOptions.map((option) => (
          <KairosOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selectedActivityLevel === option.value}
            onPress={() => setValue("activityLevel", option.value)}
          />
        ))}
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Calcular metas e continuar
      </KairosButton>
    </KairosScreen>
  );
}
