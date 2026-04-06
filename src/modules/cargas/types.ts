import { PaginatedResponse } from "@/types/pagination";

export interface Carga {
  idCarga?: number;
  tipoCarga: string;
  descripcionCarga: string;
  codigoSeguimiento?: string;
}

export type CargaPaginatedResponse = PaginatedResponse<Carga>;
