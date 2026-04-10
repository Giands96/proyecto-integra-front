import { z } from "zod";

export const camionSchema = z.object({
  placa: z.string().min(1, "Placa es requerida").max(15, "Maximo 15 caracteres"),
  disponible: z.boolean(),
});
