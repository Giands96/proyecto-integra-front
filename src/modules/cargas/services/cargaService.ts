import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { Carga, CargaPaginatedResponse } from "../types";

export const cargaService = {
  listar: async (page: number = 0, size: number = 10) => {
    return getWithCache<CargaPaginatedResponse>(API_ROUTES.CARGAS, {
      params: { page, size },
    }, 60000);
  },
  crear: async (carga: Carga) => {
    const response = await api.post<Carga>(API_ROUTES.CARGAS, carga);
    invalidateCacheByPrefix(API_ROUTES.CARGAS);
    return response.data;
  },
  actualizar: async (id: number, carga: Carga) => {
    const response = await api.put<Carga>(`${API_ROUTES.CARGAS}/${id}`, carga);
    invalidateCacheByPrefix(API_ROUTES.CARGAS);
    return response.data;
  },
  eliminar: async (id: number) => {
    await api.delete(`${API_ROUTES.CARGAS}/${id}`);
    invalidateCacheByPrefix(API_ROUTES.CARGAS);
  },
  actualizarEstado: async (idCarga: number, nuevoEstado: string) => {
    // enviamos null en el body porque el endpoint solo necesita el nuevo estado como parámetro
    // el backend actualizará el estado de la carga y devolverá la carga actualizada
    const response = await api.put(`${API_ROUTES.CARGAS}/${idCarga}/estado`, null, {
      params: { nuevoEstado } 
    });
    invalidateCacheByPrefix(API_ROUTES.CARGAS);
    return response.data;
  }
};
