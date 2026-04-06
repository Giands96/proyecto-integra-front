import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "../../../lib/apiCache";
import { Cliente } from "../types";

export const clienteService = {
  listar: async () => {
    return getWithCache<Cliente[]>("/api/clientes");
  },
  crear: async (cliente: Cliente) => {
    const response = await api.post<Cliente>("/api/clientes", cliente);
    invalidateCacheByPrefix("/api/clientes");
    return response.data;
  },
  actualizar: async (id: number, cliente: Cliente) => {
    const response = await api.put<Cliente>(`/api/clientes/${id}`, cliente);
    invalidateCacheByPrefix("/api/clientes");
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/api/clientes/${id}`);
    invalidateCacheByPrefix("/api/clientes");
  },
};
