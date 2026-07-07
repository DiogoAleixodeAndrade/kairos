import type {
  GeneratedTrainingPlan,
  GenerateTrainingPlanInput,
} from "@/features/training/training.types";
import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/stores/profile.store";
import { useProgressStore } from "@/stores/progress.store";

type GenerateTrainingPlanResponse = {
  plan?: GeneratedTrainingPlan;
  error?: string;
};

const OBJECTIVE_LABEL: Record<string, string> = {
  cut: "perda de gordura",
  maintain: "manutenção",
  gain: "ganho de massa",
};

// monta o input padrão a partir do perfil + progresso
export function buildDefaultTrainingInput(): GenerateTrainingPlanInput {
  const profile = useProfileStore.getState();
  const progress = useProgressStore.getState().getSummary();

  return {
    displayName: profile.displayName,
    objective: OBJECTIVE_LABEL[profile.objective] ?? profile.objective,
    level: "intermediario",
    weightKg: progress.currentWeightKg,
    daysPerWeek: 5,
    sessionMinutes: 60,
    restrictions: "",
  };
}

export async function generateTrainingPlan(
  input: GenerateTrainingPlanInput
): Promise<GeneratedTrainingPlan> {
  const { data, error } = await supabase.functions.invoke<GenerateTrainingPlanResponse>(
    "generate-training-plan",
    {
      body: { input },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.plan) {
    throw new Error(data?.error || "A Kairos AI não retornou um plano de treino.");
  }

  return data.plan;
}
