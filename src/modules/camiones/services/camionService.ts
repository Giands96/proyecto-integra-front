import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Camion } from "../types";

export const camionService = {
  listar: async () => {
    return getWithCache<Camion[]>("/api/camiones");
  },
  crear: async (camion: Camion) => {
    const response = await api.post<Camion>("/api/camiones", camion);
    invalidateCacheByPrefix("/api/camiones");
    return response.data;
  },
  actualizar: async (id: number, camion: Camion) => {
    const response = await api.put<Camion>(`/api/camiones/${id}`, camion);
    invalidateCacheByPrefix("/api/camiones");
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/api/camiones/${id}`);
    invalidateCacheByPrefix("/api/camiones");
  },
};
