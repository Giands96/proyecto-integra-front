import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "../../../lib/apiCache";
import { Terminal, TerminalPaginatedResponse } from "../types";
import { API_ROUTES } from "../../../../shared/routes";

export const terminalService = {
  listar: async (page: number = 0, size: number = 10): Promise<TerminalPaginatedResponse> => {
    return getWithCache<TerminalPaginatedResponse>(`${API_ROUTES.TERMINALES}?page=${page}&size=${size}`, undefined, 60000);
  },
  crear: async (terminal: Terminal) => {
    const response = await api.post<Terminal>(API_ROUTES.TERMINALES, terminal);
    invalidateCacheByPrefix(API_ROUTES.TERMINALES);
    return response.data;
  },
  actualizar: async (id: number, terminal: Terminal) => {
    const response = await api.put<Terminal>(`${API_ROUTES.TERMINALES}/${id}`, terminal);
    invalidateCacheByPrefix(API_ROUTES.TERMINALES);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.TERMINALES}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.TERMINALES);
  },
};
