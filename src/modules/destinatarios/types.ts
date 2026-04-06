import { PaginatedResponse } from "@/types/pagination";

export interface Destinatario {
  idDestinatario?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  telefono: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccionEntrega: string;
}

export type DestinatarioPaginatedResponse = PaginatedResponse<Destinatario>;
