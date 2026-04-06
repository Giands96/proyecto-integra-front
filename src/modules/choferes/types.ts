import { PaginatedResponse } from "@/types/pagination";

export interface Chofer {
  idUsuario?: number;
  nombres: string;
  apellidos: string;
  username: string;
  rol: string;
  fechaCreacion?: string;
  nombresCompletos?: string;
  disponibilidad?: number;
}

export interface ChoferUpdatePayload {
  username: string;
  nombres: string;
  apellidos: string;
  rol: "CHOFER";
  password?: string;
}

export type ChoferPaginatedResponse = PaginatedResponse<Chofer>;
