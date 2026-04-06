import { z } from "zod";

export const citaSchema = z.object({
  idCliente: z.coerce.number().min(1, "Cliente es requerido"),
  idDestinatario: z.coerce.number().min(1, "Destinatario es requerido"),
  idTerminalOrigen: z.coerce.number().min(1, "Origen es requerido"),
  idTerminalDestino: z.coerce.number().optional(),
  idCarga: z.coerce.number().min(1, "Carga es requerida"),
  idChofer: z.coerce.number().optional(),
  idCamion: z.coerce.number().optional(),
  observacion: z.string().optional(),
});
