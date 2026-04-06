import { z } from "zod";

export const citaSchema = z.object({
  idCliente: z.coerce.number().min(1, "Cliente es requerido"),
  idDestinatario: z.coerce.number().min(1, "Destinatario es requerido"),
  idTerminalOrigen: z.coerce.number().min(1, "Origen es requerido"),
  idTerminalDestino: z.coerce.number().optional(),
  idCarga: z.coerce.number().min(1, "Carga es requerida"),
  idChofer: z.coerce.number().optional(),
  idCamion: z.coerce.number().optional(),
  diasEstimados: z.coerce.number().min(1, "Dias estimados es requerido").max(7, "Dias estimados no puede ser mayor a 7"),
  observacion: z.string().optional(),
});
