import { KairosScreen } from "@/components/layout/KairosScreen";
import { KairosButton } from "@/components/ui/KairosButton";
import { KairosCard } from "@/components/ui/KairosCard";
import { KairosInput } from "@/components/ui/KairosInput";
import { KairosText } from "@/components/ui/KairosText";
import {
  addMeasurementSchema,
  type AddMeasurementFormData,
} from "@/features/progress/progress.schema";
import { useProgressStore } from "@/stores/progress.store";
import { colors } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useGamificationStore } from "@/stores/gamification.store";
import { scheduleSafeAutoSync } from "@/features/sync/auto-sync.service";

function toOptionalNumber(value?: string) {
  if (!value) return undefined;

  const normalized = value.replace(",", ".");
  const number = Number(normalized);

  return Number.isFinite(number) && number > 0 ? number : undefined;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function MeasurementsScreen() {
  const addMeasurement = useProgressStore((state) => state.addMeasurement);
  const measurements = useProgressStore((state) => state.measurements);
  const latest = useProgressStore((state) => state.getLatestMeasurement());

  const awardAction = useGamificationStore((state) => state.awardAction);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddMeasurementFormData>({
    resolver: zodResolver(addMeasurementSchema),
    defaultValues: {
      neckCm: latest?.neckCm ? String(latest.neckCm) : "",
      chestCm: latest?.chestCm ? String(latest.chestCm) : "",
      waistCm: latest?.waistCm ? String(latest.waistCm) : "",
      abdomenCm: latest?.abdomenCm ? String(latest.abdomenCm) : "",
      hipCm: latest?.hipCm ? String(latest.hipCm) : "",
      armCm: latest?.armCm ? String(latest.armCm) : "",
      thighCm: latest?.thighCm ? String(latest.thighCm) : "",
      calfCm: latest?.calfCm ? String(latest.calfCm) : "",
      notes: "",
    },
  });

  function onSubmit(data: AddMeasurementFormData) {
    addMeasurement({
      neckCm: toOptionalNumber(data.neckCm),
      chestCm: toOptionalNumber(data.chestCm),
      waistCm: toOptionalNumber(data.waistCm),
      abdomenCm: toOptionalNumber(data.abdomenCm),
      hipCm: toOptionalNumber(data.hipCm),
      armCm: toOptionalNumber(data.armCm),
      thighCm: toOptionalNumber(data.thighCm),
      calfCm: toOptionalNumber(data.calfCm),
      notes: data.notes,
    });

    awardAction("measurement_logged");
    scheduleSafeAutoSync();

    router.back();
  }

  return (
    <KairosScreen>
      <KairosText variant="label" color={colors.purple}>
        Medidas corporais
      </KairosText>

      <KairosText variant="title" style={{ marginTop: 18 }}>
        Registre suas medidas.
      </KairosText>

      <KairosText variant="subtitle" style={{ marginTop: 10 }}>
        Nem toda evolução aparece na balança. As medidas mostram mudanças reais no corpo.
      </KairosText>

      <View style={{ gap: 14, marginTop: 28 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="neckCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Pescoço"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.neckCm?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="chestCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Peito"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.chestCm?.message}
              />
            )}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="waistCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Cintura"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.waistCm?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="abdomenCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Abdômen"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.abdomenCm?.message}
              />
            )}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="hipCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Quadril"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.hipCm?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="armCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Braço"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.armCm?.message}
              />
            )}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Controller
            control={control}
            name="thighCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Coxa"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.thighCm?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="calfCm"
            render={({ field: { onChange, value } }) => (
              <KairosInput
                label="Panturrilha"
                placeholder="cm"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                error={errors.calfCm?.message}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <KairosInput
              label="Observação"
              placeholder="Ex: medidas tiradas em jejum"
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
        Salvar medidas
      </KairosButton>

      <KairosButton variant="ghost" style={{ marginTop: 8 }} onPress={() => router.back()}>
        Cancelar
      </KairosButton>

      <KairosText variant="label" color={colors.gold} style={{ marginTop: 28 }}>
        Últimos registros
      </KairosText>

      <View style={{ gap: 12, marginTop: 14 }}>
        {measurements.slice(0, 5).map((measurement) => (
          <KairosCard key={measurement.id} style={{ borderRadius: 18 }}>
            <KairosText variant="body" style={{ fontWeight: "900" }}>
              {formatDate(measurement.measuredAt)}
            </KairosText>

            <KairosText variant="subtitle" style={{ marginTop: 6 }}>
              Cintura: {measurement.waistCm ?? "-"} cm • Abdômen:{" "}
              {measurement.abdomenCm ?? "-"} cm • Peito: {measurement.chestCm ?? "-"} cm
            </KairosText>
          </KairosCard>
        ))}
      </View>
    </KairosScreen>
  );
}