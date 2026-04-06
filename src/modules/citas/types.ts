import { PaginatedResponse } from "@/types/pagination";
import { Cliente } from "../clientes/types";
import { Destinatario } from "../destinatarios/types";
import { Terminal } from "../terminales/types";
import { Carga } from "../cargas/types";
import { Chofer } from "../choferes/types";
import { Camion } from "../camiones/types";

export interface Cita {
  idCita?: number;
  fechaCreacion: string;
}

export interface DetalleCita {
  idDetalle: number;
  cita: Cita;
  cliente: Cliente;
  destinatario: Destinatario;
  terminalOrigen: Terminal;
  terminalDestino?: Terminal;
  carga: Carga;
  chofer?: Chofer;
  camion?: Camion;
  fechaRegistro: string;
  estado: string;
  diasEstimados: number;
  observacion?: string;
}

export interface CitaCompletaRequest {
  idCliente: number;
  idDestinatario: number;
  idTerminalOrigen: number;
  idTerminalDestino?: number;
  idCarga: number;
  idChofer?: number;
  idCamion?: number;
  observacion?: string;
}

export type DetalleCitaPaginatedResponse = PaginatedResponse<DetalleCita>;
