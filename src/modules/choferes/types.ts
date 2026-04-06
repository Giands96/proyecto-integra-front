import { PaginatedResponse } from "@/types/pagination";

export interface Chofer {
  idChofer?: number;
  nombresCompletos: string;
  licencia: string;
  disponibilidad: number;
  usuario?: {
    idUsuario?: number;
    username?: string;
  };
}

export type ChoferPaginatedResponse = PaginatedResponse<Chofer>;
