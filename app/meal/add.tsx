import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import { estimateMealWithAI } from "@/features/nutrition/meal-ai.service";
import { estimateMealFromText } from "@/features/nutrition/nutrition-estimator.service";
import {
  addMealSchema,
  type AddMealFormData,
} from "@/features/nutrition/nutrition.schema";
import type { MealType } from "@/features/nutrition/nutrition.types";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useGamificationStore } from "@/stores/gamification.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Brain, Pencil } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";

type AddMealMode = "ai" | "manual";

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

function getMealTitleByType(mealType: MealType) {
  const option = mealOptions.find((item) => item.value === mealType);

  return option?.title ?? "Refeição";
}

export default function AddMealScreen() {
  const addMeal = useNutritionStore((state) => state.addMeal);
  const awardAction = useGamificationStore((state) => state.awardAction);

  const [mode, setMode] = useState<AddMealMode>("ai");
  const [description, setDescription] = useState("");
  const [isEstimating, setIsEstimating] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddMealFormData>({
    resolver: zodResolver(addMealSchema),
    defaultValues: {
      title: "Almoço",
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
  const calories = toNumber(watch("caloriesKcal") || "0");
  const protein = toNumber(watch("proteinG") || "0");
  const carbs = toNumber(watch("carbsG") || "0");
  const fat = toNumber(watch("fatG") || "0");

  async function handleEstimateMeal() {
    const trimmedDescription = description.trim();

    if (trimmedDescription.length < 3) {
      Alert.alert("Descrição incompleta", "Descreva o que você comeu.");
      return;
    }

    setIsEstimating(true);

    try {
      const estimated = await estimateMealWithAI(trimmedDescription);

      setValue("title", getMealTitleByType(selectedMealType));
      setValue("foodName", estimated.foodName);
      setValue("quantityG", String(Math.round(estimated.quantityG)));
      setValue("caloriesKcal", String(Math.round(estimated.caloriesKcal)));
      setValue("proteinG", String(Math.round(estimated.proteinG)));
      setValue("carbsG", String(Math.round(estimated.carbsG)));
      setValue("fatG", String(Math.round(estimated.fatG)));

      Alert.alert(
        "Estimativa gerada pela IA",
        "A Kairos estimou os macros com Gemini API. Revise os dados antes de salvar.",
      );
    } catch (error) {
      console.warn("Erro na Gemini API, usando estimativa local:", error);

      const estimated = estimateMealFromText(trimmedDescription);

      setValue("title", getMealTitleByType(selectedMealType));
      setValue("foodName", estimated.foodName);
      setValue("quantityG", String(Math.round(estimated.quantityG)));
      setValue("caloriesKcal", String(Math.round(estimated.caloriesKcal)));
      setValue("proteinG", String(Math.round(estimated.proteinG)));
      setValue("carbsG", String(Math.round(estimated.carbsG)));
      setValue("fatG", String(Math.round(estimated.fatG)));

      Alert.alert(
        "Estimativa local gerada",
        "A Gemini API não respondeu agora, então a Kairos usou uma estimativa local. Revise antes de salvar.",
      );
    } finally {
      setIsEstimating(false);
    }
  }

  function onSubmit(data: AddMealFormData) {
    const caloriesKcal = toNumber(data.caloriesKcal);
    const quantityG = toNumber(data.quantityG);

    if (caloriesKcal <= 0 || quantityG <= 0) {
      Alert.alert(
        "Dados inválidos",
        "Confira a quantidade e as calorias da refeição.",
      );
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
    scheduleSafeAutoSync();

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
        Descreva sua refeição para a Kairos estimar calorias e macros ou
        preencha tudo manualmente.
      </KairosText>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 28 }}>
        <KairosButton
          variant={mode === "ai" ? "primary" : "secondary"}
          style={{ flex: 1 }}
          onPress={() => setMode("ai")}
        >
          IA rápida
        </KairosButton>

        <KairosButton
          variant={mode === "manual" ? "primary" : "secondary"}
          style={{ flex: 1 }}
          onPress={() => setMode("manual")}
        >
          Manual
        </KairosButton>
      </View>

      {mode === "ai" ? (
        <KairosCard variant="purple" style={{ marginTop: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Brain color={colors.purple} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="label" color={colors.purple}>
                Estimativa inteligente
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                Exemplo: 2 pães com ovo e queijo.
              </KairosText>
            </View>
          </View>

          <KairosInput
            label="Descreva a refeição"
            placeholder="Ex: 2 pães com 2 ovos e queijo"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ minHeight: 90, textAlignVertical: "top" }}
            containerStyle={{ marginTop: 16 }}
          />

          <KairosButton
            style={{ marginTop: 14 }}
            loading={isEstimating}
            onPress={handleEstimateMeal}
          >
            {isEstimating
              ? "Estimando com Gemini..."
              : "Estimar calorias e macros"}
          </KairosButton>
        </KairosCard>
      ) : (
        <KairosCard variant="gold" style={{ marginTop: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pencil color={colors.gold} size={24} />

            <View style={{ flex: 1 }}>
              <KairosText variant="label" color={colors.gold}>
                Cadastro manual
              </KairosText>

              <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                Preencha os dados nutricionais com precisão.
              </KairosText>
            </View>
          </View>
        </KairosCard>
      )}

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Tipo de refeição
      </KairosText>

      <View style={{ gap: 10, marginTop: 14 }}>
        {mealOptions.map((option) => (
          <KairosOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selectedMealType === option.value}
            onPress={() => {
              setValue("mealType", option.value);
              setValue("title", option.title);
            }}
          />
        ))}
      </View>

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

        <KairosCard style={{ borderRadius: 18 }}>
          <KairosText variant="label" color={colors.gold}>
            Prévia nutricional
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {Math.round(calories)} kcal
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 6 }}>
            Proteína {Math.round(protein)}g • Carbo {Math.round(carbs)}g •
            Gordura {Math.round(fat)}g
          </KairosText>
        </KairosCard>

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
              />
            )}
          />
        </View>
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Salvar refeição
      </KairosButton>

      <KairosButton
        variant="ghost"
        style={{ marginTop: 8 }}
        onPress={() => router.back()}
      >
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}
