import { z } from "zod";

export const addWeightSchema = z.object({
  weightKg: z.string().min(1, "Digite seu peso."),
  notes: z.string().optional(),
});

export const addMeasurementSchema = z.object({
  neckCm: z.string().optional(),
  chestCm: z.string().optional(),
  waistCm: z.string().optional(),
  abdomenCm: z.string().optional(),
  hipCm: z.string().optional(),
  armCm: z.string().optional(),
  thighCm: z.string().optional(),
  calfCm: z.string().optional(),
  notes: z.string().optional(),
});

export const addProgressPhotoSchema = z.object({
  type: z.enum(["front", "side", "back", "free"]),
  notes: z.string().optional(),
});

export type AddWeightFormData = z.infer<typeof addWeightSchema>;
export type AddMeasurementFormData = z.infer<typeof addMeasurementSchema>;
export type AddProgressPhotoFormData = z.infer<typeof addProgressPhotoSchema>;