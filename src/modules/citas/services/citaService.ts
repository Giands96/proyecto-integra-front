import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { DetalleCitaPaginatedResponse, CitaCompletaRequest } from "../types";

export const citaService = {
  listarDetalles: async (page: number = 0, size: number = 10) => {
    return getWithCache<DetalleCitaPaginatedResponse>(API_ROUTES.CITAS.DETALLES, {
      params: { page, size },
    }, 60000);
  },
  guardarCompleta: async (data: CitaCompletaRequest) => {
    const response = await api.post<string>(API_ROUTES.CITAS.GUARDAR, data);
    invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
    return response.data;
  },
};
