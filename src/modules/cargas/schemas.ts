import { z } from "zod";

export const cargaSchema = z.object({
  tipoCarga: z.string().min(1, "Tipo de carga es requerido"),
  descripcionCarga: z.string().min(1, "Descripcion es requerida"),
});
