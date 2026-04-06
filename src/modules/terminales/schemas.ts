import { z } from "zod";

export const terminalSchema = z.object({
  nombreUbicacion: z.string().min(1, "Nombre de ubicacion es requerido"),
  departamento: z.string().min(1, "Departamento es requerido"),
  provincia: z.string().min(1, "Provincia es requerida"),
  distrito: z.string().min(1, "Distrito es requerido"),
});
