import { z } from "zod";

export const addSleepSchema = z.object({
  sleptAt: z.string().min(1, "Digite o horário que dormiu."),
  wokeUpAt: z.string().min(1, "Digite o horário que acordou."),
  durationMinutes: z.string().min(1, "Digite o tempo total de sono em minutos."),
  qualityScore: z.string().min(1, "Digite a qualidade do sono."),
  energyScore: z.string().min(1, "Digite sua energia ao acordar."),
  interruptions: z.string().min(1, "Digite o número de interrupções."),
  notes: z.string().optional(),
});

export type AddSleepFormData = z.infer<typeof addSleepSchema>;