import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Destinatario, DestinatarioPaginatedResponse } from "../types";
import { API_ROUTES } from "../../../../shared/routes";

export const destinatarioService = {
  listar: async (page: number = 0, size: number = 10): Promise<DestinatarioPaginatedResponse> => {
    return getWithCache<DestinatarioPaginatedResponse>(`${API_ROUTES.DESTINATARIOS}?page=${page}&size=${size}`, undefined, 60000);
  },
  crear: async (destinatario: Destinatario) => {
    const response = await api.post<Destinatario>(API_ROUTES.DESTINATARIOS, destinatario);
    invalidateCacheByPrefix(API_ROUTES.DESTINATARIOS);
    return response.data;
  },
  actualizar: async (id: number, destinatario: Destinatario) => {
    const response = await api.put<Destinatario>(`${API_ROUTES.DESTINATARIOS}/${id}`, destinatario);
    invalidateCacheByPrefix(API_ROUTES.DESTINATARIOS);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.DESTINATARIOS}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.DESTINATARIOS);
  },
};
