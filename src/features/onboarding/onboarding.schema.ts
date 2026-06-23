import { z } from "zod";

export const journeyModeSchema = z.object({
  journeyMode: z.enum(["from_scratch", "with_history"]),
});

export const physicalDataSchema = z.object({
  name: z.string().min(2, "Digite seu nome."),
  age: z.string().min(1, "Digite sua idade."),
  currentWeightKg: z.string().min(1, "Digite seu peso atual."),
  heightCm: z.string().min(1, "Digite sua altura."),
});

export const journeyHistorySchema = z.object({
  journeyStartDate: z.string().min(1, "Digite a data de início."),
  journeyStartWeightKg: z.string().min(1, "Digite seu peso inicial."),
  targetWeightKg: z.string().min(1, "Digite seu peso alvo."),
});

export type JourneyModeFormData = z.infer<typeof journeyModeSchema>;
export type PhysicalDataFormData = z.infer<typeof physicalDataSchema>;
export type JourneyHistoryFormData = z.infer<typeof journeyHistorySchema>;