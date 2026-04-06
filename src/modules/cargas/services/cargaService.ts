import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Carga } from "../types";

export const cargaService = {
  listar: async () => {
    return getWithCache<Carga[]>("/api/cargas");
  },
  crear: async (carga: Carga) => {
    const response = await api.post<Carga>("/api/cargas", carga);
    invalidateCacheByPrefix("/api/cargas");
    return response.data;
  },
  actualizar: async (id: number, carga: Carga) => {
    const response = await api.put<Carga>(`/api/cargas/${id}`, carga);
    invalidateCacheByPrefix("/api/cargas");
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/api/cargas/${id}`);
    invalidateCacheByPrefix("/api/cargas");
  },
};
