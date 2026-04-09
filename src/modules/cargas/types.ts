import { PaginatedResponse } from "@/types/pagination";

export type ESTADO_CARGA = "PENDIENTE" | "EN_TRANSITO" | "ENTREGADA" | "CANCELADA";

export interface Carga {
  idCarga?: number;
  tipoCarga: string;
  descripcionCarga: string;
  codigoSeguimiento?: string;
  estado: string;
  cliente?: Record<string, unknown>;
}

export type CargaPaginatedResponse = PaginatedResponse<Carga>;
