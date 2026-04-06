import { z } from "zod";

export const choferSchema = z.object({
  idUsuario: z.coerce.number().min(1, "Empleado es requerido"),
  licencia: z.string().min(1, "Licencia es requerida"),
  disponibilidad: z.coerce.number().min(0).max(1),
});
