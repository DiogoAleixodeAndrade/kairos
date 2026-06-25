import { KairosHeader } from "@/components/layout/KairosHeader";
import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { router } from "expo-router";
import { Target } from "lucide-react-native";
import { useState } from "react";
import { Alert, View } from "react-native";

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

export default function NutritionGoalsScreen() {
  const targets = useNutritionStore((state) => state.targets);
  const setTargets = useNutritionStore((state) => state.setTargets);

  const [caloriesKcal, setCaloriesKcal] = useState(String(targets.caloriesKcal));
  const [proteinG, setProteinG] = useState(String(targets.proteinG));
  const [carbsG, setCarbsG] = useState(String(targets.carbsG));
  const [fatG, setFatG] = useState(String(targets.fatG));
  const [waterMl, setWaterMl] = useState(String(targets.waterMl));

  const previewCalories = toNumber(caloriesKcal);
  const previewProtein = toNumber(proteinG);
  const previewCarbs = toNumber(carbsG);
  const previewFat = toNumber(fatG);
  const previewWater = toNumber(waterMl);

  function handleSave() {
    if (previewCalories <= 0 || previewProtein <= 0 || previewWater <= 0) {
      Alert.alert("Metas inválidas", "Confira calorias, proteína e água.");
      return;
    }

    setTargets({
      caloriesKcal: Math.round(previewCalories),
      proteinG: Math.round(previewProtein),
      carbsG: Math.round(previewCarbs),
      fatG: Math.round(previewFat),
      waterMl: Math.round(previewWater),
    });

    scheduleSafeAutoSync();

    Alert.alert("Metas atualizadas", "Suas metas nutricionais foram salvas.");

    router.back();
  }

  return (
    <KairosScreen>
      <KairosHeader
        title="Metas nutricionais"
        subtitle="Ajuste calorias, macros e água de acordo com sua estratégia atual."
      />

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Target color={colors.gold} size={26} />

          <View style={{ flex: 1 }}>
            <KairosText variant="label" color={colors.gold}>
              Prévia das metas
            </KairosText>

            <KairosText variant="metric" style={{ marginTop: 12 }}>
              {Math.round(previewCalories)} kcal
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              P {Math.round(previewProtein)}g • C {Math.round(previewCarbs)}g • G{" "}
              {Math.round(previewFat)}g
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 4 }}>
              Água: {(previewWater / 1000).toFixed(1)}L por dia
            </KairosText>
          </View>
        </View>
      </KairosCard>

      <View style={{ gap: 14, marginTop: 24 }}>
        <KairosInput
          label="Calorias diárias"
          placeholder="Ex: 2600"
          keyboardType="numeric"
          value={caloriesKcal}
          onChangeText={setCaloriesKcal}
        />

        <KairosInput
          label="Proteína diária em gramas"
          placeholder="Ex: 190"
          keyboardType="numeric"
          value={proteinG}
          onChangeText={setProteinG}
        />

        <KairosInput
          label="Carboidratos diários em gramas"
          placeholder="Ex: 260"
          keyboardType="numeric"
          value={carbsG}
          onChangeText={setCarbsG}
        />

        <KairosInput
          label="Gorduras diárias em gramas"
          placeholder="Ex: 80"
          keyboardType="numeric"
          value={fatG}
          onChangeText={setFatG}
        />

        <KairosInput
          label="Água diária em ml"
          placeholder="Ex: 3000"
          keyboardType="numeric"
          value={waterMl}
          onChangeText={setWaterMl}
        />
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSave}>
        Salvar metas
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}