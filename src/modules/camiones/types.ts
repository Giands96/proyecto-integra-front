import { PaginatedResponse } from "@/types/pagination";

export interface Camion {
  idCamion?: number;
  placa: string;
  disponibilidad: number;
}

export type CamionPaginatedResponse = PaginatedResponse<Camion>;
