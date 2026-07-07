import { supabase } from "@/lib/supabase";
import { useAIStore } from "@/stores/ai.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useProgressStore } from "@/stores/progress.store";
import { useSleepStore } from "@/stores/sleep.store";
import { useTrainingStore } from "@/stores/training.store";

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

/* =========================================================================
 * Fatia 2 — tabelas aninhadas (pais + filhos com FK)
 *
 *   meals            + meal_items
 *   ai_conversations + ai_messages
 *   workouts         + workout_exercises + workout_logs (a partir das sessões)
 *
 * Cada domínio é isolado: se um falhar, os outros continuam. Continua sendo
 * best-effort — o snapshot JSON segue como fonte de verdade do restore.
 * ========================================================================= */

async function insertReturningId(table: string, row: any): Promise<string> {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Erro ao gravar ${table}: ${error.message}`);
  }

  return (data as { id: string }).id;
}

async function pushMeals(userId: string) {
  const nutrition = useNutritionStore.getState();

  // apaga refeições (cascade remove meal_items)
  const { error: deleteError } = await supabase
    .from("meals")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Erro ao limpar meals: ${deleteError.message}`);
  }

  for (const meal of nutrition.meals) {
    const mealId = await insertReturningId("meals", {
      user_id: userId,
      meal_type: meal.mealType,
      title: meal.title,
      eaten_at: meal.eatenAt,
      notes: meal.notes ?? null,
    });

    if (meal.items.length === 0) continue;

    const items = meal.items.map((item) => ({
      user_id: userId,
      meal_id: mealId,
      food_name: item.foodName,
      quantity_g: item.quantityG,
      calories_kcal: item.caloriesKcal,
      protein_g: item.proteinG,
      carbs_g: item.carbsG,
      fat_g: item.fatG,
    }));

    const { error: itemsError } = await supabase.from("meal_items").insert(items);

    if (itemsError) {
      throw new Error(`Erro ao gravar meal_items: ${itemsError.message}`);
    }
  }
}

async function pushAIMessages(userId: string) {
  const ai = useAIStore.getState();

  // apaga conversas (cascade remove ai_messages)
  const { error: deleteError } = await supabase
    .from("ai_conversations")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Erro ao limpar ai_conversations: ${deleteError.message}`);
  }

  if (ai.messages.length === 0) return;

  // uma conversa guarda-chuva para as mensagens locais (que são uma lista plana)
  const conversationId = await insertReturningId("ai_conversations", {
    user_id: userId,
    title: "Chat Kairos AI",
  });

  const messages = ai.messages.map((message) => ({
    user_id: userId,
    conversation_id: conversationId,
    role: message.role,
    content: message.content,
    created_at: message.createdAt,
  }));

  const { error: messagesError } = await supabase.from("ai_messages").insert(messages);

  if (messagesError) {
    throw new Error(`Erro ao gravar ai_messages: ${messagesError.message}`);
  }
}

async function pushWorkoutSessions(userId: string) {
  const training = useTrainingStore.getState();

  // apaga workouts (cascade remove workout_exercises e workout_logs)
  const { error: deleteError } = await supabase
    .from("workouts")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Erro ao limpar workouts: ${deleteError.message}`);
  }

  for (const session of training.sessions) {
    const workoutId = await insertReturningId("workouts", {
      user_id: userId,
      title: session.title,
      workout_type: "strength",
      started_at: session.startedAt,
      finished_at: session.finishedAt ?? null,
      duration_minutes: session.durationMinutes ?? null,
      estimated_calories_burned: session.estimatedCalories ?? null,
      status: "completed",
    });

    // agrupa as séries por exercício, preservando a ordem de aparição
    const order: string[] = [];
    const byExercise = new Map<string, typeof session.setLogs>();

    for (const setLog of session.setLogs) {
      if (!byExercise.has(setLog.exerciseId)) {
        byExercise.set(setLog.exerciseId, []);
        order.push(setLog.exerciseId);
      }
      byExercise.get(setLog.exerciseId)!.push(setLog);
    }

    for (let index = 0; index < order.length; index += 1) {
      const exerciseId = order[index];
      const setLogs = byExercise.get(exerciseId)!;

      const workoutExerciseId = await insertReturningId("workout_exercises", {
        user_id: userId,
        workout_id: workoutId,
        exercise_name: setLogs[0].exerciseName,
        order_index: index,
        target_sets: setLogs.length,
      });

      const logs = setLogs.map((setLog: (typeof setLogs)[number]) => ({
        user_id: userId,
        workout_exercise_id: workoutExerciseId,
        set_number: setLog.setNumber,
        reps: setLog.reps,
        weight_kg: setLog.weightKg,
        completed: setLog.completed,
      }));

      const { error: logsError } = await supabase.from("workout_logs").insert(logs);

      if (logsError) {
        throw new Error(`Erro ao gravar workout_logs: ${logsError.message}`);
      }
    }
  }
}

export async function pushNestedTablesToSupabase(userId: string) {
  const domains: { name: string; run: () => Promise<void> }[] = [
    { name: "meals", run: () => pushMeals(userId) },
    { name: "ai_messages", run: () => pushAIMessages(userId) },
    { name: "workout_sessions", run: () => pushWorkoutSessions(userId) },
  ];

  for (const domain of domains) {
    try {
      await domain.run();
    } catch (error) {
      console.warn(
        `Sync da tabela ${domain.name} falhou:`,
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }
}