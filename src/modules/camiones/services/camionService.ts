import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { Camion, CamionPaginatedResponse } from "../types";

function toDisponibilidadValue(value: unknown): 0 | 1 {
  return Number(value) === 1 ? 1 : 0;
}

function normalizeCamion(item: unknown): Camion {
  const parsed = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
  return {
    idCamion: Number(parsed.idCamion ?? 0),
    placa: String(parsed.placa ?? ""),
    disponible: toDisponibilidadValue(parsed.disponible ?? parsed.disponibilidad),
  };
}

export const camionService = {
  listar: async (page: number = 0, size: number = 10) => {
    const response = await getWithCache<CamionPaginatedResponse>(API_ROUTES.CAMIONES, {
      params: { page, size },
    }, 60000);

    const normalizedContent = Array.isArray(response.content)
      ? response.content.map((camion) => normalizeCamion(camion))
      : [];

    return {
      ...response,
      content: normalizedContent,
    };
  },
  crear: async (camion: Camion) => {
    const payload = {
      ...camion,
      disponibilidad: toDisponibilidadValue(camion.disponible),
    };
    const response = await api.post<Camion>(API_ROUTES.CAMIONES, payload);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
    return response.data;
  },
  actualizar: async (id: number, camion: Camion) => {
    const payload = {
      ...camion,
      disponibilidad: toDisponibilidadValue(camion.disponible),
    };
    const response = await api.put<Camion>(`${API_ROUTES.CAMIONES}/${id}`, payload);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.CAMIONES}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
  },
};
