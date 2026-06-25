import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosOptionCard } from "@/components/ui/KairosOptionCard";
import { KairosText } from "@/components/ui/KairosText";
import type { MealType } from "@/features/nutrition/nutrition.types";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";
import { useNutritionStore } from "@/stores/nutrition.store";
import { colors } from "@/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";

type EditableMealItem = {
  id: string;
  foodName: string;
  quantityG: string;
  caloriesKcal: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
};

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

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function toEditableItem(item: {
  id: string;
  foodName: string;
  quantityG: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}): EditableMealItem {
  return {
    id: item.id,
    foodName: item.foodName,
    quantityG: String(item.quantityG),
    caloriesKcal: String(item.caloriesKcal),
    proteinG: String(item.proteinG),
    carbsG: String(item.carbsG),
    fatG: String(item.fatG),
  };
}

export default function EditMealScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const mealId = params.id;

  const meals = useNutritionStore((state) => state.meals);
  const updateMeal = useNutritionStore((state) => state.updateMeal);

  const meal = meals.find((item) => item.id === mealId);

  const [title, setTitle] = useState(meal?.title ?? "");
  const [mealType, setMealType] = useState<MealType>(meal?.mealType ?? "lunch");
  const [notes, setNotes] = useState(meal?.notes ?? "");
  const [items, setItems] = useState<EditableMealItem[]>(
    meal?.items.map(toEditableItem) ?? [
      {
        id: createId(),
        foodName: "",
        quantityG: "",
        caloriesKcal: "",
        proteinG: "",
        carbsG: "",
        fatG: "",
      },
    ],
  );

  const totals = useMemo(() => {
    return items.reduce(
      (total, item) => {
        return {
          quantityG: total.quantityG + toNumber(item.quantityG),
          caloriesKcal: total.caloriesKcal + toNumber(item.caloriesKcal),
          proteinG: total.proteinG + toNumber(item.proteinG),
          carbsG: total.carbsG + toNumber(item.carbsG),
          fatG: total.fatG + toNumber(item.fatG),
        };
      },
      {
        quantityG: 0,
        caloriesKcal: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
      },
    );
  }, [items]);

  if (!meal) {
    return (
      <KairosScreen>
        <KairosText variant="title">Refeição não encontrada</KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 10 }}>
          Essa refeição pode ter sido removida.
        </KairosText>

        <KairosButton style={{ marginTop: 28 }} onPress={() => router.back()}>
          Voltar
        </KairosButton>
      </KairosScreen>
    );
  }

  const currentMeal = meal;

  function updateItem(
    itemId: string,
    field: keyof EditableMealItem,
    value: string,
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((currentItems) => [
      ...currentItems,
      {
        id: createId(),
        foodName: "",
        quantityG: "",
        caloriesKcal: "",
        proteinG: "",
        carbsG: "",
        fatG: "",
      },
    ]);
  }

  function removeItem(itemId: string) {
    if (items.length === 1) {
      Alert.alert("Atenção", "A refeição precisa ter pelo menos um item.");
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  function handleSave() {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      Alert.alert("Nome inválido", "Digite o nome da refeição.");
      return;
    }

    const invalidItem = items.find((item) => {
      return (
        item.foodName.trim().length < 2 ||
        toNumber(item.quantityG) <= 0 ||
        toNumber(item.caloriesKcal) < 0
      );
    });

    if (invalidItem) {
      Alert.alert(
        "Item inválido",
        "Confira se todos os itens têm nome, quantidade e calorias válidas.",
      );
      return;
    }

    updateMeal(currentMeal.id, {
      title: trimmedTitle,
      mealType,
      eatenAt: currentMeal.eatenAt,
      notes: notes.trim(),
      items: items.map((item) => ({
        id: item.id,
        foodName: item.foodName.trim(),
        quantityG: toNumber(item.quantityG),
        caloriesKcal: toNumber(item.caloriesKcal),
        proteinG: toNumber(item.proteinG),
        carbsG: toNumber(item.carbsG),
        fatG: toNumber(item.fatG),
      })),
    });

    scheduleSafeAutoSync();

    router.replace(`/meal/${currentMeal.id}`);
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.gold}>
        Editar refeição
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Ajuste os dados
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Edite a refeição, adicione vários itens e corrija os macros com mais
        precisão.
      </KairosText>

      <KairosCard variant="gold" style={{ marginTop: 28 }}>
        <KairosText variant="label" color={colors.gold}>
          Total da refeição
        </KairosText>

        <KairosText variant="metric" style={{ marginTop: 14 }}>
          {Math.round(totals.caloriesKcal)} kcal
        </KairosText>

        <KairosText variant="subtitle" style={{ marginTop: 6 }}>
          Proteína {Math.round(totals.proteinG)}g • Carbo{" "}
          {Math.round(totals.carbsG)}g • Gordura {Math.round(totals.fatG)}g
        </KairosText>
      </KairosCard>

      <View style={{ gap: 14, marginTop: 24 }}>
        <KairosInput
          label="Nome da refeição"
          placeholder="Ex: Almoço"
          value={title}
          onChangeText={setTitle}
        />

        <KairosInput
          label="Observação"
          placeholder="Ex: pós-treino, refeição livre..."
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ minHeight: 86, textAlignVertical: "top" }}
        />
      </View>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Tipo de refeição
      </KairosText>

      <View style={{ gap: 10, marginTop: 14 }}>
        {mealOptions.map((option) => (
          <KairosOptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={mealType === option.value}
            onPress={() => {
              setMealType(option.value);
              setTitle(option.title);
            }}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 28,
        }}
      >
        <KairosText variant="label" color={colors.gold}>
          Itens da refeição
        </KairosText>

        <KairosText variant="subtitle">{items.length} itens</KairosText>
      </View>

      <View style={{ gap: 14, marginTop: 14 }}>
        {items.map((item, index) => (
          <KairosCard key={item.id} style={{ borderRadius: 18 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <KairosText variant="body" style={{ fontWeight: "900" }}>
                  Item {index + 1}
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {Math.round(toNumber(item.caloriesKcal))} kcal
                </KairosText>
              </View>

              <Pressable
                onPress={() => removeItem(item.id)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.06)",
                })}
              >
                <Trash2 color={colors.danger} size={20} />
              </Pressable>
            </View>

            <View style={{ gap: 12, marginTop: 16 }}>
              <KairosInput
                label="Alimento"
                placeholder="Ex: Arroz"
                value={item.foodName}
                onChangeText={(value) => updateItem(item.id, "foodName", value)}
              />

              <KairosInput
                label="Quantidade em gramas"
                placeholder="Ex: 120"
                keyboardType="numeric"
                value={item.quantityG}
                onChangeText={(value) =>
                  updateItem(item.id, "quantityG", value)
                }
              />

              <KairosInput
                label="Calorias"
                placeholder="Ex: 180"
                keyboardType="numeric"
                value={item.caloriesKcal}
                onChangeText={(value) =>
                  updateItem(item.id, "caloriesKcal", value)
                }
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <KairosInput
                  label="Proteína"
                  placeholder="10"
                  keyboardType="numeric"
                  value={item.proteinG}
                  onChangeText={(value) =>
                    updateItem(item.id, "proteinG", value)
                  }
                />

                <KairosInput
                  label="Carbo"
                  placeholder="30"
                  keyboardType="numeric"
                  value={item.carbsG}
                  onChangeText={(value) => updateItem(item.id, "carbsG", value)}
                />

                <KairosInput
                  label="Gord."
                  placeholder="5"
                  keyboardType="numeric"
                  value={item.fatG}
                  onChangeText={(value) => updateItem(item.id, "fatG", value)}
                />
              </View>
            </View>
          </KairosCard>
        ))}
      </View>

      <KairosButton
        variant="secondary"
        style={{ marginTop: 18 }}
        onPress={addItem}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Plus color={colors.white} size={18} />

          <KairosText
            variant="body"
            color={colors.white}
            style={{ fontWeight: "900" }}
          >
            Adicionar item
          </KairosText>
        </View>
      </KairosButton>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSave}>
        Salvar alterações
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
