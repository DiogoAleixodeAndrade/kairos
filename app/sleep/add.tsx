import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import { addSleepSchema, type AddSleepFormData } from "@/features/sleep/sleep.schema";
import { useSleepStore } from "@/stores/sleep.store";
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

export default function AddSleepScreen() {
  const addSleepLog = useSleepStore((state) => state.addSleepLog);

  const awardAction = useGamificationStore((state) => state.awardAction);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddSleepFormData>({
    resolver: zodResolver(addSleepSchema),
    defaultValues: {
      sleptAt: "23:30",
      wokeUpAt: "06:30",
      durationMinutes: "420",
      qualityScore: "7",
      energyScore: "7",
      interruptions: "1",
      notes: "",
    },
  });

  function onSubmit(data: AddSleepFormData) {
    const durationMinutes = toNumber(data.durationMinutes);
    const qualityScore = toNumber(data.qualityScore);
    const energyScore = toNumber(data.energyScore);
    const interruptions = toNumber(data.interruptions);

    if (durationMinutes <= 0) {
      Alert.alert("Tempo inválido", "Digite o tempo total de sono em minutos.");
      return;
    }

    if (qualityScore < 1 || qualityScore > 10 || energyScore < 1 || energyScore > 10) {
      Alert.alert("Nota inválida", "Qualidade e energia precisam estar entre 1 e 10.");
      return;
    }

    addSleepLog({
      sleptAt: data.sleptAt,
      wokeUpAt: data.wokeUpAt,
      durationMinutes,
      qualityScore,
      energyScore,
      interruptions,
      notes: data.notes,
    });

    awardAction("sleep_logged");

    router.back();
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.purple}>
        Registrar sono
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Como foi sua noite?
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        A Kairos AI usa seu sono para ajustar treino, recuperação, fome e performance.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="sleptAt"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Dormiu"
                placeholder="23:30"
                value={value}
                onChangeText={onChange}
                error={errors.sleptAt?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="wokeUpAt"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Acordou"
                placeholder="06:30"
                value={value}
                onChangeText={onChange}
                error={errors.wokeUpAt?.message}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="durationMinutes"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Tempo total em minutos"
              placeholder="Ex: 420"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.durationMinutes?.message}
            />
          )}
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="qualityScore"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Qualidade"
                placeholder="1 a 10"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.qualityScore?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="energyScore"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Energia"
                placeholder="1 a 10"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.energyScore?.message}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="interruptions"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Interrupções"
              placeholder="Ex: 1"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.interruptions?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Observação"
              placeholder="Ex: acordei cansado, dormi tarde..."
              value={value}
              onChangeText={onChange}
              multiline
              error={errors.notes?.message}
              style={{ minHeight: 90, textAlignVertical: "top" }}
            />
          )}
        />
      </View>

      <KairosButton style={{ marginTop: 28 }} onPress={handleSubmit(onSubmit)}>
        Salvar sono
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>
    </KairosScreen>
  );
}