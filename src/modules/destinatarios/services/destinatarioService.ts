import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Destinatario } from "../types";

export const destinatarioService = {
  listar: async () => {
    return getWithCache<Destinatario[]>("/api/destinatarios");
  },
  crear: async (destinatario: Destinatario) => {
    const response = await api.post<Destinatario>("/api/destinatarios", destinatario);
    invalidateCacheByPrefix("/api/destinatarios");
    return response.data;
  },
};
