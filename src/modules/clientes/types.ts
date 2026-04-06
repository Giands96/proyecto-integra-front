import { PaginatedResponse } from "@/types/pagination";

export interface Cliente {
  idCliente?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombresRazonSocial: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export type ClientePaginatedResponse = PaginatedResponse<Cliente>;
