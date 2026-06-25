import { supabase } from "@/lib/supabase";

export type EstimatedMeal = {
  foodName: string;
  quantityG: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

type EstimateMealResponse = {
  estimate: EstimatedMeal;
  error?: string;
};

export async function estimateMealWithAI(description: string): Promise<EstimatedMeal> {
  const { data, error } = await supabase.functions.invoke<EstimateMealResponse>("estimate-meal", {
    body: {
      description,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.estimate) {
    throw new Error(data?.error || "Não foi possível estimar a refeição.");
  }

  return data.estimate;
}