import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { Camion, CamionPaginatedResponse } from "../types";

export const camionService = {
  listar: async (page: number = 0, size: number = 10) => {
    return getWithCache<CamionPaginatedResponse>(API_ROUTES.CAMIONES, {
      params: { page, size },
    }, 60000);
  },
  crear: async (camion: Camion) => {
    const response = await api.post<Camion>(API_ROUTES.CAMIONES, camion);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
    return response.data;
  },
  actualizar: async (id: number, camion: Camion) => {
    const response = await api.put<Camion>(`${API_ROUTES.CAMIONES}/${id}`, camion);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.CAMIONES}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.CAMIONES);
  },
};
