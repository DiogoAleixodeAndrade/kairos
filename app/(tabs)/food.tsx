import { KairosMacroCard } from "@/components/cards/KairosMacroCard";
import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosProgressBar } from "@/components/ui/KairosProgressBar";
import { KairosText } from "@/components/ui/KairosText";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Droplets, Plus } from "lucide-react-native";
import { View } from "react-native";

const mealTypeLabels = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  snack: "Lanche",
  dinner: "Jantar",
  supper: "Ceia",
  other: "Outro",
};

export default function FoodScreen() {
  const {
    targets,
    addWater,
    clearTodayWater,
    getTodayMeals,
    getTodaySummary,
  } = useNutritionStore();

  const meals = getTodayMeals();
  const summary = getTodaySummary();

  const caloriesPercentage =
    targets.caloriesKcal > 0
      ? Math.round((summary.caloriesKcal / targets.caloriesKcal) * 100)
      : 0;

  const waterLiters = summary.waterMl / 1000;
  const waterTargetLiters = targets.waterMl / 1000;

  return (
    <KairosScreen>
      <KairosHeader
        title="Alimentação"
        subtitle="Registre suas refeições, acompanhe macros e mantenha sua estratégia alinhada."
      />

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.gold}>
              Calorias
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 18 }}>
              {Math.round(summary.caloriesKcal)}
            </KairosText>

            <KairosText variant="subtitle">
              de {targets.caloriesKcal} kcal
            </KairosText>
          </View>

          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              borderWidth: 8,
              borderColor: "rgba(214,168,79,0.22)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KairosText
              variant="body"
              color={colors.gold}
              style={{ fontSize: 22, fontWeight: "900" }}
            >
              {caloriesPercentage}%
            </KairosText>
          </View>
        </View>

        <KairosProgressBar
          value={summary.caloriesKcal}
          max={targets.caloriesKcal}
          color={colors.gold}
          style={{ marginTop: 18 }}
        />
      </KairosCard>

      <KairosCard style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.white}>
          Macros de hoje
        </KairosText>

        <View style={{ gap: 18, marginTop: 18 }}>
          <KairosMacroCard
            label="Proteína"
            current={Math.round(summary.proteinG)}
            target={targets.proteinG}
            unit="g"
            color={colors.gold}
          />

          <KairosMacroCard
            label="Carboidratos"
            current={Math.round(summary.carbsG)}
            target={targets.carbsG}
            unit="g"
            color={colors.blue}
          />

          <KairosMacroCard
            label="Gorduras"
            current={Math.round(summary.fatG)}
            target={targets.fatG}
            unit="g"
            color={colors.purple}
          />
        </View>
      </KairosCard>

      <KairosCard variant="blue" style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Droplets color={colors.blue} size={24} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.blue}>
              Água
            </KairosText>

            <KairosText variant="body" style={{ fontSize: 26, fontWeight: "900", marginTop: 4 }}>
              {waterLiters.toFixed(1)}L / {waterTargetLiters.toFixed(1)}L
            </KairosText>
          </View>
        </View>

        <KairosProgressBar
          value={summary.waterMl}
          max={targets.waterMl}
          color={colors.blue}
          style={{ marginTop: 18 }}
        />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <KairosButton style={{ flex: 1 }} onPress={() => addWater(250)}>
            +250ml
          </KairosButton>

          <KairosButton style={{ flex: 1 }} variant="secondary" onPress={() => addWater(500)}>
            +500ml
          </KairosButton>
        </View>

        <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={clearTodayWater}>
          Zerar água de hoje
        </KairosButton>
      </KairosCard>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Refeições
        </KairosText>

        <KairosText variant="subtitle">
          {meals.length} hoje
        </KairosText>
      </View>

      <KairosButton
        style={{ marginTop: 14 }}
        onPress={() => router.push("/meal/add")}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Plus color={colors.background} size={18} />
          <KairosText variant="body" color={colors.background} style={{ fontWeight: "900" }}>
            Adicionar refeição
          </KairosText>
        </View>
      </KairosButton>

      <View style={{ gap: 12, marginTop: 18 }}>
        {meals.length === 0 ? (
          <KairosCard>
            <KairosText variant="body" style={{ fontWeight: "800" }}>
              Nenhuma refeição registrada hoje.
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              Adicione sua primeira refeição para a Kairos AI analisar seus macros.
            </KairosText>
          </KairosCard>
        ) : (
          meals.map((meal) => {
            const calories = meal.items.reduce((total, item) => total + item.caloriesKcal, 0);
            const protein = meal.items.reduce((total, item) => total + item.proteinG, 0);

            return (
              <KairosCard key={meal.id} style={{ borderRadius: 18 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <KairosText variant="body" style={{ fontWeight: "900" }}>
                      {meal.title}
                    </KairosText>

                    <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                      {mealTypeLabels[meal.mealType]} • {Math.round(protein)}g proteína
                    </KairosText>
                  </View>

                  <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                    {Math.round(calories)} kcal
                  </KairosText>
                </View>
              </KairosCard>
            );
          })
        )}
      </View>
    </KairosScreen>
  );
}