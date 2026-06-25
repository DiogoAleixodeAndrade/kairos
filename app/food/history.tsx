import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import {
  getNutritionHistoryByPeriod,
  getNutritionHistoryTotals,
  type NutritionHistoryPeriod,
} from "@/features/nutrition/nutrition-history.service";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { CalendarDays, Droplets, Flame, Utensils } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

const periodOptions: { label: string; value: NutritionHistoryPeriod }[] = [
  {
    label: "7 dias",
    value: 7,
  },
  {
    label: "14 dias",
    value: 14,
  },
  {
    label: "30 dias",
    value: 30,
  },
];

const mealTypeLabels = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  snack: "Lanche",
  dinner: "Jantar",
  supper: "Ceia",
  other: "Outro",
};

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FoodHistoryScreen() {
  const meals = useNutritionStore((state) => state.meals);
  const waterLogs = useNutritionStore((state) => state.waterLogs);

  const [period, setPeriod] = useState<NutritionHistoryPeriod>(7);

  const days = useMemo(() => {
    return getNutritionHistoryByPeriod(meals, waterLogs, period);
  }, [meals, waterLogs, period]);

  const totals = useMemo(() => {
    return getNutritionHistoryTotals(days);
  }, [days]);

  const daysWithData = useMemo(() => {
    return [...days].reverse();
  }, [days]);

  return (
    <KairosScreen>
      <KairosHeader
        title="Histórico alimentar"
        subtitle="Analise sua consistência por período e veja como seus macros evoluíram."
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 28 }}>
        {periodOptions.map((option) => (
          <KairosButton
            key={option.value}
            variant={period === option.value ? "primary" : "secondary"}
            style={{ flex: 1, paddingVertical: 14 }}
            onPress={() => setPeriod(option.value)}
          >
            {option.label}
          </KairosButton>
        ))}
      </View>

      <KairosCard variant="gold" style={{ marginTop: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Flame color={colors.gold} size={26} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.gold}>
              Média alimentar
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 12 }}>
              {totals.averageCalories}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              kcal por dia com registros
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <View style={{ flexDirection: "row", gap: 14, marginTop: 14 }}>
        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.gold}>
            Proteína
          </KairosText>

          <KairosText variant="body" style={{ fontSize: 26, fontWeight: "900", marginTop: 10 }}>
            {totals.averageProtein}g
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            média diária
          </KairosText>
        </KairosCard>

        <KairosCard style={{ flex: 1 }}>
          <KairosText variant="label" color={colors.blue}>
            Água
          </KairosText>

          <KairosText variant="body" style={{ fontSize: 26, fontWeight: "900", marginTop: 10 }}>
            {(totals.averageWaterMl / 1000).toFixed(1)}L
          </KairosText>

          <KairosText variant="subtitle" style={{ marginTop: 4 }}>
            média diária
          </KairosText>
        </KairosCard>
      </View>

      <KairosCard variant="purple" style={{ marginTop: 14 }}>
        <KairosText variant="label" color={colors.purple}>
          Resumo do período
        </KairosText>

        <View style={{ gap: 12, marginTop: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <KairosText variant="subtitle">Dias com registro</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {totals.activeDaysCount}/{period}
            </KairosText>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <KairosText variant="subtitle">Refeições registradas</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {totals.mealsCount}
            </KairosText>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <KairosText variant="subtitle">Calorias totais</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {Math.round(totals.caloriesKcal)} kcal
            </KairosText>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <KairosText variant="subtitle">Macros médios</KairosText>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              P {totals.averageProtein}g • C {totals.averageCarbs}g • G {totals.averageFat}g
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Dias do período
      </KairosText>

      <View style={{ gap: 14, marginTop: 14 }}>
        {daysWithData.map((day) => {
          const percentage = Math.max(4, Math.round((day.caloriesKcal / totals.maxCalories) * 100));

          return (
            <KairosCard key={day.date} style={{ borderRadius: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <CalendarDays color={colors.gold} size={22} />

                <View style={{ flex: 1 }}>
                  <KairosText
                    variant="body"
                    style={{ fontWeight: "900", textTransform: "capitalize" }}
                  >
                    {day.fullLabel}
                  </KairosText>

                  <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                    {day.meals.length} refeições • {(day.waterMl / 1000).toFixed(1)}L água
                  </KairosText>
                </View>

                <KairosText variant="body" color={colors.gold} style={{ fontWeight: "900" }}>
                  {Math.round(day.caloriesKcal)} kcal
                </KairosText>
              </View>

              <View
                style={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  marginTop: 14,
                }}
              >
                <View
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    borderRadius: 999,
                    backgroundColor: colors.gold,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <KairosText variant="subtitle">Proteína</KairosText>
                  <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                    {Math.round(day.proteinG)}g
                  </KairosText>
                </View>

                <View style={{ flex: 1 }}>
                  <KairosText variant="subtitle">Carbo</KairosText>
                  <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                    {Math.round(day.carbsG)}g
                  </KairosText>
                </View>

                <View style={{ flex: 1 }}>
                  <KairosText variant="subtitle">Gordura</KairosText>
                  <KairosText variant="body" style={{ fontWeight: "900", marginTop: 2 }}>
                    {Math.round(day.fatG)}g
                  </KairosText>
                </View>
              </View>

              {day.meals.length > 0 ? (
                <View style={{ gap: 10, marginTop: 16 }}>
                  {day.meals.map((meal) => (
                    <Pressable
                      key={meal.id}
                      onPress={() => router.push(`/meal/${meal.id}`)}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.82 : 1,
                      })}
                    >
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 16,
                          padding: 14,
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <KairosText variant="body" style={{ fontWeight: "900" }}>
                              {meal.title}
                            </KairosText>

                            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                              {mealTypeLabels[meal.mealType]} • {formatTime(meal.eatenAt)}
                            </KairosText>
                          </View>

                          <KairosText
                            variant="body"
                            color={colors.gold}
                            style={{ fontWeight: "900" }}
                          >
                            {Math.round(meal.caloriesKcal)} kcal
                          </KairosText>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 16,
                    padding: 14,
                    marginTop: 16,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <KairosText variant="subtitle">Nenhuma refeição registrada neste dia.</KairosText>
                </View>
              )}
            </KairosCard>
          );
        })}
      </View>

      <KairosButton variant="secondary" style={{ marginTop: 28 }} onPress={() => router.back()}>
        Voltar
      </KairosButton>

      <View style={{ height: 12 }} />
    </KairosScreen>
  );
}