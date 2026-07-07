import { supabase } from "@/lib/supabase";
import { useAIStore } from "@/stores/ai.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";

/**
 * Sincronização por tabela real (Etapa 32).
 *
 * Cobre as tabelas "planas" (1 registro local -> 1 linha), cujas RLS
 * permitem insert/delete pelo próprio usuário:
 *   nutrition_targets, water_logs, sleep_logs, weight_logs,
 *   body_measurements, progress_photos, ai_reports
 *
 * NÃO cobre (ainda):
 *   - xp_logs / user_levels / achievements  (RLS só permite SELECT ao client)
 *   - meals / meal_items, workouts / workout_exercises / workout_logs,
 *     ai_conversations / ai_messages  (tabelas aninhadas com FKs -> próxima fatia)
 *
 * O snapshot JSON continua sendo a fonte de verdade do restore. Este push
 * apenas popula as tabelas reais para dashboards e backup por tabela.
 */

function toDateOnly(iso: string) {
  // "2024-05-20T12:00:00.000Z" -> "2024-05-20"
  return new Date(iso).toISOString().slice(0, 10);
}

function clampScore(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

async function replaceTable(table: string, userId: string, rows: any[]) {
  const { error: deleteError } = await supabase.from(table).delete().eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Erro ao limpar ${table}: ${deleteError.message}`);
  }

  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from(table).insert(rows);

  if (insertError) {
    throw new Error(`Erro ao gravar ${table}: ${insertError.message}`);
  }
}

export async function pushFlatTablesToSupabase(userId: string) {
  const nutrition = useNutritionStore.getState();
  const sleep = useSleepStore.getState();
  const progress = useProgressStore.getState();
  const ai = useAIStore.getState();

  // nutrition_targets (um registro por usuário)
  await replaceTable("nutrition_targets", userId, [
    {
      user_id: userId,
      calories_kcal: Math.round(nutrition.targets.caloriesKcal),
      protein_g: nutrition.targets.proteinG,
      carbs_g: nutrition.targets.carbsG,
      fat_g: nutrition.targets.fatG,
      water_ml: Math.round(nutrition.targets.waterMl),
      created_by: "app",
    },
  ]);

  // water_logs (amount_ml deve ser > 0)
  await replaceTable(
    "water_logs",
    userId,
    nutrition.waterLogs
      .filter((log) => log.amountMl > 0)
      .map((log) => ({
        user_id: userId,
        amount_ml: Math.round(log.amountMl),
        logged_at: log.loggedAt,
      }))
  );

  // sleep_logs
  await replaceTable(
    "sleep_logs",
    userId,
    sleep.sleepLogs.map((log) => ({
      user_id: userId,
      slept_at: log.sleptAt,
      woke_up_at: log.wokeUpAt,
      duration_minutes: Math.round(log.durationMinutes),
      quality_score: clampScore(log.qualityScore, 1, 10),
      energy_score: clampScore(log.energyScore, 1, 10),
      interruptions: Math.max(0, Math.round(log.interruptions)),
      notes: log.notes ?? null,
    }))
  );

  // weight_logs
  await replaceTable(
    "weight_logs",
    userId,
    progress.weightLogs.map((log) => ({
      user_id: userId,
      weight_kg: log.weightKg,
      logged_at: toDateOnly(log.loggedAt),
      notes: log.notes ?? null,
    }))
  );

  // body_measurements
  await replaceTable(
    "body_measurements",
    userId,
    progress.measurements.map((measurement) => ({
      user_id: userId,
      measured_at: toDateOnly(measurement.measuredAt),
      neck_cm: measurement.neckCm ?? null,
      chest_cm: measurement.chestCm ?? null,
      waist_cm: measurement.waistCm ?? null,
      abdomen_cm: measurement.abdomenCm ?? null,
      hip_cm: measurement.hipCm ?? null,
      arm_cm: measurement.armCm ?? null,
      thigh_cm: measurement.thighCm ?? null,
      calf_cm: measurement.calfCm ?? null,
      notes: measurement.notes ?? null,
    }))
  );

  // progress_photos (photo_path é obrigatório no schema)
  await replaceTable(
    "progress_photos",
    userId,
    progress.photos.map((photo) => ({
      user_id: userId,
      photo_url: photo.uri,
      photo_path: photo.uri,
      photo_type: photo.type,
      taken_at: toDateOnly(photo.takenAt),
      notes: photo.notes ?? null,
    }))
  );

  // ai_reports (guarda o formato novo completo em raw_payload)
  await replaceTable(
    "ai_reports",
    userId,
    ai.reports.map((report) => ({
      user_id: userId,
      report_date: toDateOnly(report.createdAt),
      title: report.title,
      summary: report.summary,
      recommendation: report.recommendation ?? null,
      consistency_score: clampScore(report.consistencyScore, 0, 100),
      status: "generated",
      raw_payload: report,
    }))
  );
}
