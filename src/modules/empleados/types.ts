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
  role: "ADMINISTRADOR" | "OPERADOR" | "CHOFER";
  nombres: string;
  apellidos: string;
}

export type EmpleadoPaginatedResponse = PaginatedResponse<Empleado>;
