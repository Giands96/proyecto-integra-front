import { z } from "zod";

export const clienteSchema = z.object({
  tipoDocumento: z.string().min(1, "Tipo de documento es requerido"),
  numeroDocumento: z.string().min(1, "Numero de documento es requerido"),
  nombresRazonSocial: z.string().min(1, "Nombre o Razon Social es requerido"),
  departamento: z.string().min(1, "Departamento es requerido"),
  provincia: z.string().min(1, "Provincia es requerida"),
  distrito: z.string().min(1, "Distrito es requerido"),
});
