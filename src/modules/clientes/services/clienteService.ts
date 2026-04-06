import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { Cliente, ClientePaginatedResponse } from "../types";
import { API_ROUTES } from "../../../../shared/routes";

export const clienteService = {
  listar: async (page: number = 0, size: number = 10): Promise<ClientePaginatedResponse> => {
    return getWithCache<ClientePaginatedResponse>(`${API_ROUTES.CLIENTES}?page=${page}&size=${size}`, undefined, 60000);
  },
  crear: async (cliente: Cliente) => {
    const response = await api.post<Cliente>(API_ROUTES.CLIENTES, cliente);
    invalidateCacheByPrefix(API_ROUTES.CLIENTES);
    return response.data;
  },
  actualizar: async (id: number, cliente: Cliente) => {
    const response = await api.put<Cliente>(`${API_ROUTES.CLIENTES}/${id}`, cliente);
    invalidateCacheByPrefix(API_ROUTES.CLIENTES);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.CLIENTES}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.CLIENTES);
  },
};
