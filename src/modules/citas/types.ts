import { PaginatedResponse } from "@/types/pagination";
import { Cliente } from "../clientes/types";
import { Destinatario } from "../destinatarios/types";
import { Terminal } from "../terminales/types";
import { Carga } from "../cargas/types";
import { Camion } from "../camiones/types";
import { Empleado } from "../empleados/types";

export interface Cita {
  idCita?: number;
  fechaCreacion: string;
}

export interface DetalleCita {
  idDetalle: number;
  usuario: Empleado;
  cita: Cita;
  cliente: Cliente;
  destinatario: Destinatario;
  terminalOrigen: Terminal;
  terminalDestino?: Terminal;
  carga: Carga;
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
  idCamion?: number;
  diasEstimados: number;
  observacion?: string;
}

export type DetalleCitaPaginatedResponse = PaginatedResponse<DetalleCita>;
