import { PaginatedResponse } from "@/types/pagination";

export interface Empleado {
  nombres: string;
  apellidos: string;
  idUsuario: number;
  username: string;
  role: string;
}

export interface CrearEmpleadoPayload {
  username: string;
  password: string;
  rol: "ADMINISTRADOR" | "OPERADOR" | "CHOFER";
  nombres: string;
  apellidos: string;
}

export interface ActualizarEmpleadoPayload {
  nombres: string;
  apellidos: string;
  rol: "ADMINISTRADOR" | "OPERADOR" | "CHOFER";
}

export type EmpleadoPaginatedResponse = PaginatedResponse<Empleado>;
