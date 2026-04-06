import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Chofer } from "../types";

export const choferService = {
  listar: async () => {
    return getWithCache<Chofer[]>("/api/choferes");
  },
  crear: async (chofer: Chofer) => {
    const response = await api.post<Chofer>("/api/choferes", chofer);
    invalidateCacheByPrefix("/api/choferes");
    return response.data;
  },
  actualizar: async (id: number, chofer: Chofer) => {
    const response = await api.put<Chofer>(`/api/choferes/${id}`, chofer);
    invalidateCacheByPrefix("/api/choferes");
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/api/choferes/${id}`);
    invalidateCacheByPrefix("/api/choferes");
  },
};
