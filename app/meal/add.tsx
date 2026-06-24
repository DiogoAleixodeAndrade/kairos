import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import { addMealSchema, type AddMealFormData } from "@/features/nutrition/nutrition.schema";
import type { MealType } from "@/features/nutrition/nutrition.types";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";

const mealOptions: { value: MealType; title: string; description: string }[] = [
  {
    value: "breakfast",
    title: "Café da manhã",
    description: "Primeira refeição do dia.",
  },
  {
    value: "lunch",
    title: "Almoço",
    description: "Refeição principal do meio do dia.",
  },
  {
    value: "snack",
    title: "Lanche",
    description: "Refeição rápida ou intermediária.",
  },
  {
    value: "dinner",
    title: "Jantar",
    description: "Refeição principal da noite.",
  },
  {
    value: "supper",
    title: "Ceia",
    description: "Última refeição antes de dormir.",
  },
  {
    value: "other",
    title: "Outro",
    description: "Qualquer outra refeição.",
  },
];

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

export default function AddMealScreen() {
  const addMeal = useNutritionStore((state) => state.addMeal);

  const awardAction = useGamificationStore((state) => state.awardAction);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddMealFormData>({
    resolver: zodResolver(addMealSchema),
    defaultValues: {
      title: "",
      mealType: "lunch",
      foodName: "",
      quantityG: "",
      caloriesKcal: "",
      proteinG: "",
      carbsG: "",
      fatG: "",
    },
  });

  const selectedMealType = watch("mealType");

  function onSubmit(data: AddMealFormData) {
    const caloriesKcal = toNumber(data.caloriesKcal);
    const quantityG = toNumber(data.quantityG);

    if (caloriesKcal <= 0 || quantityG <= 0) {
      Alert.alert("Dados inválidos", "Confira a quantidade e as calorias da refeição.");
      return;
    }

    addMeal({
      title: data.title.trim(),
      mealType: data.mealType,
      eatenAt: new Date().toISOString(),
      items: [
        {
          id: "",
          foodName: data.foodName.trim(),
          quantityG,
          caloriesKcal,
          proteinG: toNumber(data.proteinG),
          carbsG: toNumber(data.carbsG),
          fatG: toNumber(data.fatG),
        },
      ],
    });

    awardAction("meal_logged");

    router.back();
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.gold}>
        Nova refeição
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        O que você comeu?
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Registre a refeição para atualizar calorias, macros e relatório diário da IA.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Nome da refeição"
              placeholder="Ex: Almoço"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />

        <KairosText variant="label" color={colors.gold} style={{ marginTop: 6 }}>
          Tipo de refeição
        </KairosText>

        <View style={{ gap: 10 }}>
          {mealOptions.map((option) => (
            <KairosOptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              selected={selectedMealType === option.value}
              onPress={() => setValue("mealType", option.value)}
            />
          ))}
        </View>

        <Controller
          control={control}
          name="foodName"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Alimento principal"
              placeholder="Ex: Arroz, feijão e frango"
              value={value}
              onChangeText={onChange}
              error={errors.foodName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="quantityG"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Quantidade em gramas"
              placeholder="Ex: 420"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.quantityG?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="caloriesKcal"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Calorias"
              placeholder="Ex: 620"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.caloriesKcal?.message}
            />
          )}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="proteinG"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Proteína"
                placeholder="48"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.proteinG?.message}
                style={{ minWidth: 0 }}
              />
            )}
          />

          <Controller
            control={control}
            name="carbsG"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Carbo"
                placeholder="72"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.carbsG?.message}
                style={{ minWidth: 0 }}
              />
            )}
          />

          <Controller
            control={control}
            name="fatG"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Gord."
                placeholder="14"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.fatG?.message}
                style={{ minWidth: 0 }}
              />
            )}
          />
        </View>
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Salvar refeição
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}