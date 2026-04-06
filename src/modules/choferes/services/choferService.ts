import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { Chofer, ChoferPaginatedResponse } from "../types";

export const choferService = {
  listar: async (page: number = 0, size: number = 10) => {
    return getWithCache<ChoferPaginatedResponse>(API_ROUTES.CHOFERES, {
      params: { page, size },
    }, 60000);
  },
  crear: async (chofer: Chofer) => {
    const response = await api.post<Chofer>(API_ROUTES.CHOFERES, chofer);
    invalidateCacheByPrefix(API_ROUTES.CHOFERES);
    return response.data;
  },
  actualizar: async (id: number, chofer: Chofer) => {
    const response = await api.put<Chofer>(`${API_ROUTES.CHOFERES}/${id}`, chofer);
    invalidateCacheByPrefix(API_ROUTES.CHOFERES);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.CHOFERES}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.CHOFERES);
  },
};
