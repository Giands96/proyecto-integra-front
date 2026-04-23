import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { Chofer, ChoferPaginatedResponse, ChoferUpdatePayload } from "../types";

const CHOFER_LIST_ENDPOINTS = [
  "/api/empleados/chofer",
];

const CHOFER_UPDATE_ENDPOINTS = [
  "/api/empleados",
];

type ChoferApiItem = {
  idUsuario?: number | string;
  id?: number | string;
  username?: string;
  usuario?: string;
  role?: string | Record<string, unknown>;
  rol?: string | Record<string, unknown>;
  nombreRol?: string;
  nombres?: string;
  apellidos?: string;
  fechaCreacion?: string;
  fecha_creacion?: string;
};

type ChoferListPayload = {
  usuarios?: unknown;
  users?: unknown;
  data?: unknown;
  content?: unknown;
  [key: string]: unknown;
};

function normalizeRolValue(roleValue: unknown): string {
  if (typeof roleValue === "string") {
    return roleValue;
  }

  if (typeof roleValue === "object" && roleValue !== null) {
    const roleObj = roleValue as Record<string, unknown>;
    return String(roleObj.nombreRol ?? roleObj.code ?? roleObj.nombre ?? roleObj.name ?? "SIN_ROL");
  }

  return "SIN_ROL";
}

function normalizeChofer(item: unknown): Chofer {
  const parsedItem = (item && typeof item === "object" ? item : {}) as ChoferApiItem;
  const rol = normalizeRolValue(parsedItem.rol ?? parsedItem.role ?? parsedItem.nombreRol);
  const nombres = String(parsedItem.nombres ?? "");
  const apellidos = String(parsedItem.apellidos ?? "");

  return {
    idUsuario: Number(parsedItem.idUsuario ?? parsedItem.id ?? 0),
    username: String(parsedItem.username ?? parsedItem.usuario ?? ""),
    nombres,
    apellidos,
    rol,
    fechaCreacion: String(parsedItem.fechaCreacion ?? parsedItem.fecha_creacion ?? ""),
    nombresCompletos: `${nombres} ${apellidos}`.trim(),
    // Compatibilidad temporal: el dashboard calcula disponibilidad de choferes.
    disponibilidad: 1,
  };
}

function extractChoferes(payload: unknown): Chofer[] {
  const parsedPayload = payload && typeof payload === "object" ? (payload as ChoferListPayload) : undefined;

  const raw = Array.isArray(payload)
    ? payload
    : parsedPayload?.usuarios ?? parsedPayload?.users ?? parsedPayload?.data ?? parsedPayload?.content ?? [];

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => normalizeChofer(item))
    .filter((item) => item.idUsuario && item.idUsuario > 0)
    .filter((item) => item.rol.toUpperCase() === "CHOFER");
}

function toPaginatedChoferes(payload: unknown): ChoferPaginatedResponse {
  const choferes = extractChoferes(payload);
  return {
    content: choferes,
    totalPages: 1,
    totalElements: choferes.length,
    size: choferes.length,
    number: 0,
    numberOfElements: choferes.length,
    first: true,
    last: true,
    empty: choferes.length === 0,
  };
}

export const choferService = {
  listar: async (page: number = 0, size: number = 10) => {
    let lastError: unknown;

    for (const endpoint of CHOFER_LIST_ENDPOINTS) {
      try {
        const data = await getWithCache<unknown>(`${endpoint}?page=${page}&size=${size}`, undefined, 60000);
        return toPaginatedChoferes(data);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("No se pudo obtener la lista de choferes");
  },
  actualizar: async (id: number, payload: ChoferUpdatePayload) => {
    let lastError: unknown;

    for (const endpoint of CHOFER_UPDATE_ENDPOINTS) {
      try {
        const response = await api.put<Chofer>(`${endpoint}/${id}`, payload);
        CHOFER_LIST_ENDPOINTS.forEach((item) => invalidateCacheByPrefix(item));
        CHOFER_UPDATE_ENDPOINTS.forEach((item) => invalidateCacheByPrefix(item));
        invalidateCacheByPrefix(API_ROUTES.CHOFERES);
        return response.data;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("No se pudo actualizar el chofer");
  },
  invalidateCache: () => {
    CHOFER_LIST_ENDPOINTS.forEach((endpoint) => invalidateCacheByPrefix(endpoint));
    CHOFER_UPDATE_ENDPOINTS.forEach((endpoint) => invalidateCacheByPrefix(endpoint));
    invalidateCacheByPrefix(API_ROUTES.CHOFERES);
  },
};
