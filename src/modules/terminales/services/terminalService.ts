import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Terminal } from "../types";

export const terminalService = {
  listar: async () => {
    return getWithCache<Terminal[]>("/api/terminales");
  },
  crear: async (terminal: Terminal) => {
    const response = await api.post<Terminal>("/api/terminales", terminal);
    invalidateCacheByPrefix("/api/terminales");
    return response.data;
  },
  actualizar: async (id: number, terminal: Terminal) => {
    const response = await api.put<Terminal>(`/api/terminales/${id}`, terminal);
    invalidateCacheByPrefix("/api/terminales");
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/api/terminales/${id}`);
    invalidateCacheByPrefix("/api/terminales");
  },
};
