import { z } from "zod";

export const addMealSchema = z.object({
  title: z.string().min(2, "Digite o nome da refeição."),
  mealType: z.enum(["breakfast", "lunch", "snack", "dinner", "supper", "other"]),
  foodName: z.string().min(2, "Digite o alimento."),
  quantityG: z.string().min(1, "Digite a quantidade em gramas."),
  caloriesKcal: z.string().min(1, "Digite as calorias."),
  proteinG: z.string().min(1, "Digite a proteína."),
  carbsG: z.string().min(1, "Digite os carboidratos."),
  fatG: z.string().min(1, "Digite as gorduras."),
});

export type AddMealFormData = z.infer<typeof addMealSchema>;