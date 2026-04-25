import api from "@/lib/axios";
import { TrackingCargaResult, TrackingCitaResult, TrackingResult } from "../types";
import { getHttpStatus } from "../utils";

async function buscarCargaPorTracking(idSeguimiento: string, documento: string) {
  const endpoints = [
    "/api/chat/consulta-carga/tracking",
    "/api/cargas/consulta-carga/tracking",
    "/api/consulta-carga/tracking",
    "/consulta-carga/tracking",
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await api.get<TrackingCargaResult>(endpoint, {
        params: { idSeguimiento, documento },
      });
      return response.data;
    } catch (error) {
      lastError = error;

      const status = getHttpStatus(error);
      if (status === 401 || status === 403) {
        break;
      }
    }
  }

  throw lastError ?? new Error("No se encontró la carga");
}

async function buscarCitaPorTracking(idSeguimiento: string, documento: string) {
  const endpoints = [
    `/api/public/tracking/${encodeURIComponent(idSeguimiento)}/${encodeURIComponent(documento)}`,
    "/api/citas/tracking",
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await api.get<TrackingCitaResult>(endpoint, {
        params: endpoint === "/api/citas/tracking" ? { idSeguimiento, documento } : undefined,
      });
      return response.data;
    } catch (error) {
      lastError = error;

      const status = getHttpStatus(error);
      if (status === 401 || status === 403) {
        break;
      }
    }
  }

  throw lastError ?? new Error("No se encontró la cita");
}

export const trackingService = {
  buscarPorSeguimiento: async (idSeguimiento: string, documento: string): Promise<TrackingResult> => {
    const carga = await buscarCargaPorTracking(idSeguimiento, documento);
    return { kind: "carga", data: carga };
  },
  buscarCitaFallback: async (idSeguimiento: string, documento: string): Promise<TrackingResult> => {
    const cita = await buscarCitaPorTracking(idSeguimiento, documento);
    return { kind: "cita", data: cita };
  },
};
