import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosText } from "@/components/ui/KairosText";
import { colors } from "@/styles/theme";
import { View } from "react-native";

export default function FoodScreen() {
  const meals = [
    { title: "Café da manhã", calories: 430 },
    { title: "Almoço", calories: 620 },
    { title: "Lanche", calories: 210 },
    { title: "Jantar", calories: 510 },
    { title: "Ceia", calories: 120 },
  ];

  return (
    <KairosScreen>
      <KairosHeader
        title="Alimentação"
        subtitle="Abasteça seu corpo. Eleve seu potencial."
      />

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Calorias
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 20 }}>
          1.890
          <KairosText variant="body" color={colors.muted} style={{ fontSize: 22 }}>
            {" "}
            / 2.600
          </KairosText>
        </KairosText>

        <KairosText variant="body" color={colors.gold} style={{ marginTop: 8 }}>
          72% da meta
        </KairosText>
      </KairosCard>

      <View style={{ gap: 12, marginTop: 18 }}>
        {meals.map((meal) => (
          <KairosCard key={meal.title} style={{ borderRadius: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <KairosText variant="body" style={{ fontWeight: "800" }}>
                {meal.title}
              </KairosText>

              <KairosText variant="subtitle">{meal.calories} kcal</KairosText>
            </View>
          </KairosCard>
        ))}
      </View>
    </KairosScreen>
  );
}