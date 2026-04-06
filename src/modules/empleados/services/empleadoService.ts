import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { authService } from "@/modules/auth/services/authService";
import { CrearEmpleadoPayload, Empleado, EmpleadoPaginatedResponse } from "../types";

const USER_LIST_ENDPOINTS = [
  "/api/usuarios",
  "/api/auth/usuarios",
  "/api/auth/users",
  "/api/users",
];

type EmpleadoApiItem = {
  idUsuario?: number | string;
  id?: number | string;
  username?: string;
  usuario?: string;
  role?: string | Record<string, unknown>;
  rol?: string | Record<string, unknown>;
  nombreRol?: string;
  nombres?: string;
  apellidos?: string;
};



type EmpleadoListPayload = {
  usuarios?: unknown;
  users?: unknown;
  data?: unknown;
  content?: unknown;
  [key: string]: unknown;
};

function normalizeEmpleado(item: unknown): Empleado {
  const parsedItem = (item && typeof item === "object" ? item : {}) as EmpleadoApiItem;
  
  // Extraer el string del role, incluso si viene como objeto
  let roleValue: unknown = parsedItem.role ?? parsedItem.rol ?? "SIN_ROL";
  
  if (typeof roleValue === "object" && roleValue !== null) {
    const roleObj = roleValue as Record<string, unknown>;
    // Prioridad: nombreRol (nuevo) > code > nombre > name
    roleValue = roleObj.nombreRol || roleObj.code || roleObj.nombre || roleObj.name || JSON.stringify(roleValue);
  }

  return {
    idUsuario: Number(parsedItem.idUsuario ?? parsedItem.id ?? 0),
    username: String(parsedItem.username ?? parsedItem.usuario ?? ""),
    role: String(roleValue),
    nombres: String(parsedItem.nombres ?? ""),
    apellidos: String(parsedItem.apellidos ?? ""),
  };
}

function extractEmpleados(payload: unknown): Empleado[] {
  const parsedPayload =
    payload && typeof payload === "object" ? (payload as EmpleadoListPayload) : undefined;

  const raw = Array.isArray(payload)
    ? payload
    : parsedPayload?.usuarios ?? parsedPayload?.users ?? parsedPayload?.data ?? parsedPayload?.content ?? [];

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => normalizeEmpleado(item))
    .filter((item) => item.idUsuario > 0 && item.username.length > 0);
}

function toPaginatedEmpleados(payload: unknown): EmpleadoPaginatedResponse {
  const empleados = extractEmpleados(payload);
  const parsedPayload =
    payload && typeof payload === "object" ? (payload as EmpleadoListPayload) : undefined;
  
  if (parsedPayload && Array.isArray(parsedPayload.content)) {
    return {
      ...parsedPayload,
      content: empleados,
    } as EmpleadoPaginatedResponse;
  }

  return {
    content: empleados,
    totalPages: 1,
    totalElements: empleados.length,
    size: empleados.length,
    number: 0,
    numberOfElements: empleados.length,
    first: true,
    last: true,
    empty: empleados.length === 0,
  };
}

export const empleadoService = {
  listar: async (page: number = 0, size: number = 10): Promise<EmpleadoPaginatedResponse> => {
    let lastError: unknown;

    for (const endpoint of USER_LIST_ENDPOINTS) {
      try {
        const data = await getWithCache<unknown>(`${endpoint}?page=${page}&size=${size}`);
        return toPaginatedEmpleados(data);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("No se pudo obtener la lista de empleados");
  },
  crear: async (payload: CrearEmpleadoPayload) => {
    const response = await authService.register(payload);
    USER_LIST_ENDPOINTS.forEach((endpoint) => invalidateCacheByPrefix(endpoint));
    return response;
  },
};
