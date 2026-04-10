import { PaginatedResponse } from "@/types/pagination";

export interface Camion {
  idCamion?: number;
  placa: string;
  disponible: number;
}

export type CamionPaginatedResponse = PaginatedResponse<Camion>;
