import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { DetalleCita, CitaCompletaRequest } from "../types";

export const citaService = {
  listarDetalles: async () => {
    return getWithCache<DetalleCita[]>("/api/citas/detalles");
  },
  guardarCompleta: async (data: CitaCompletaRequest) => {
    const response = await api.post<string>("/api/citas/guardar", data);
    invalidateCacheByPrefix("/api/citas");
    return response.data;
  },
};
