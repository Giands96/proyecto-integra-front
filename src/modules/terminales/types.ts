import { PaginatedResponse } from "@/types/pagination";

export interface Terminal {
  idTerminal?: number;
  nombreUbicacion: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export type TerminalPaginatedResponse = PaginatedResponse<Terminal>;
