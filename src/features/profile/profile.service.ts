import { supabase } from "@/lib/supabase";

type SavePhysicalProfileInput = {
  userId: string;
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  journeyMode: "from_scratch" | "with_history";
  journeyStartDate?: string;
  journeyStartWeightKg?: number;
};

export async function savePhysicalProfile(input: SavePhysicalProfileInput) {
  const { error } = await supabase.from("physical_profiles").upsert({
    user_id: input.userId,
    name: input.name,
    age: input.age,
    height_cm: input.heightCm,
    current_weight_kg: input.currentWeightKg,
    target_weight_kg: input.targetWeightKg,
    journey_mode: input.journeyMode,
    journey_start_date: input.journeyStartDate,
    journey_start_weight_kg: input.journeyStartWeightKg,
    journey_current_weight_kg: input.currentWeightKg,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}