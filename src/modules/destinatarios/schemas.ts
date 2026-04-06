import { z } from "zod";

export const destinatarioSchema = z.object({
  tipoDocumento: z.string().min(1, "Tipo de documento es requerido"),
  numeroDocumento: z.string().min(1, "Numero de documento es requerido"),
  nombreCompleto: z.string().min(1, "Nombre completo es requerido"),
  telefono: z.string().min(1, "Telefono es requerido"),
  departamento: z.string().min(1, "Departamento es requerido"),
  provincia: z.string().min(1, "Provincia es requerida"),
  distrito: z.string().min(1, "Distrito es requerido"),
  direccionEntrega: z.string().min(1, "Direccion de entrega es requerida"),
});
