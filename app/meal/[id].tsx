import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";

const mealTypeLabels = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  snack: "Lanche",
  dinner: "Jantar",
  supper: "Ceia",
  other: "Outro",
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}

export default function MealDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const mealId = params.id;

  const meals = useNutritionStore((state) => state.meals);
  const removeMeal = useNutritionStore((state) => state.removeMeal);

  const meal = meals.find((item) => item.id === mealId);

  if (!meal) {
    return (
      <KairosScreen>
        <KairosText variant="title">Refeição não encontrada</KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 10 }}>
          Essa refeição pode ter sido removida ou não está mais disponível.
        </KairosText>

        <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
          Voltar
        </KairosButton>
      </KairosScreen>
    );
  }

  const calories = meal.items.reduce(
    (total, item) => total + item.caloriesKcal,
    0,
  );
  const protein = meal.items.reduce((total, item) => total + item.proteinG, 0);
  const carbs = meal.items.reduce((total, item) => total + item.carbsG, 0);
  const fat = meal.items.reduce((total, item) => total + item.fatG, 0);
  const quantity = meal.items.reduce(
    (total, item) => total + item.quantityG,
    0,
  );

  function handleDeleteMeal(currentMealId: string) {
    Alert.alert(
      "Excluir refeição",
      "Tem certeza que deseja excluir essa refeição? Essa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            removeMeal(currentMealId);
            scheduleSafeAutoSync();
            router.replace("/(tabs)/food");
          },
        },
      ],
    );
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.gold}>
        Detalhes da refeição
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        {meal.title}
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        {mealTypeLabels[meal.mealType]} • {formatDateTime(meal.eatenAt)}
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Total nutricional
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 14 }}>
          {Math.round(calories)} kcal
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 6 }}>
          {Math.round(quantity)}g registrados
        </KairosText>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.gold}>
            Proteína
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {Math.round(protein)}g
          </KairosText>
        </KairosCard>

        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.blue}>
            Carbo
          </KairosText>

          <KairosText variant="metric" style={{ marginTop: 12 }}>
            {Math.round(carbs)}g
          </KairosText>
        </KairosCard>
      </View>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Gorduras
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 12 }}>
          {Math.round(fat)}g
        </KairosText>
      </KairosCard>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Itens
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {meal.items.map((item) => (
          <KairosCard key={item.id} style={{ borderRadius: 18 }}>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {item.foodName}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              {Math.round(item.quantityG)}g • {Math.round(item.caloriesKcal)}{" "}
              kcal
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              Proteína {Math.round(item.proteinG)}g • Carbo{" "}
              {Math.round(item.carbsG)}g • Gordura {Math.round(item.fatG)}g
            </KairosText>
          </KairosCard>
        ))}
      </View>

      {meal.notes ? (
        <KairosCard style={{ marginTop: 14 }}>
          <KairosText variant="label" color={colors.gold}>
            Observação
          </KairosText>

          <KairosText variant="body" style={{ marginTop: 10 }}>
            {meal.notes}
          </KairosText>
        </KairosCard>
      ) : null}

      <KairosButton
        variant="secondary"
        style={{ marginTop: 28 }}
        onPress={() => router.back()}
      >
        Voltar
      </KairosButton>

      <KairosButton
        variant="ghost"
        style={{ marginTop: 8 }}
        onPress={() => handleDeleteMeal(meal.id)}
      >
        Excluir refeição
      </KairosButton>
    </KairosScreen>
  );
}
