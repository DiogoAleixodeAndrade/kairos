import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { addWeightSchema, type AddWeightFormData } from "@/features/progress/progress.schema";
import { useProgressStore } from "@/stores/progress.store";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";

function toNumber(value: string) {
  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function WeightScreen() {
  const addWeightLog = useProgressStore((state) => state.addWeightLog);
  const weightLogs = useProgressStore((state) => state.weightLogs);
  const currentWeight = useProgressStore((state) => state.getCurrentWeight());

  const awardAction = useGamificationStore((state) => state.awardAction);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddWeightFormData>({
    resolver: zodResolver(addWeightSchema),
    defaultValues: {
      weightKg: String(currentWeight),
      notes: "",
    },
  });

  function onSubmit(data: AddWeightFormData) {
    const weightKg = toNumber(data.weightKg);

    if (weightKg <= 0) {
      Alert.alert("Peso inválido", "Digite um peso válido.");
      return;
    }

    addWeightLog({
      weightKg,
      notes: data.notes,
    });

    awardAction("weight_logged");

    router.back();
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.gold}>
        Registro de peso
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Atualize seu peso.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        O Kairos usa seu peso para calcular evolução, tendência e ajustes inteligentes.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <Controller
          control={control}
          name="weightKg"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Peso atual"
              placeholder="Ex: 145"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.weightKg?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Observação"
              placeholder="Ex: pesei em jejum"
              value={value}
              onChangeText={onChange}
              multiline
              style={{ minHeight: 90, textAlignVertical: "top" }}
              error={errors.notes?.message}
            />
          )}
        />
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Salvar peso
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Histórico
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {weightLogs.slice(0, 8).map((log) => (
          <KairosCard key={log.id} style={{ borderRadius: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <KairosText variant="body" style={{ fontWeight: "900" }}>
                  {log.weightKg.toFixed(1)} kg
                </KairosText>

                <KairosText variant="subtitle" style={{ marginTop: 4 }}>
                  {formatDate(log.loggedAt)}
                </KairosText>
              </View>

              {log.notes ? (
                <KairosText variant="subtitle" style={{ maxWidth: 150, textAlign: "right" }}>
                  {log.notes}
                </KairosText>
              ) : null}
            </View>
          </KairosCard>
        ))}
      </View>
    </KairosScreen>
  );
}