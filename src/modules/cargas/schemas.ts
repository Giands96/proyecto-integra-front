import { z } from "zod";

export const cargaSchema = z.object({
  tipoCarga: z.string().min(1, "El tipo de carga es requerido"),
  descripcionCarga: z.string().min(1, "La descripción es requerida"),
  idCliente: z.coerce.number().min(1, "El cliente es requerido"),
});
