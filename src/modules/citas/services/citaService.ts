import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { DetalleCitaPaginatedResponse, CitaCompletaRequest, EstadoCita } from "../types";

const ESTADO_ENDPOINTS = [
  (id: number) => `${API_ROUTES.CITAS.DETALLES}/${id}/estado`,
  (id: number) => `${API_ROUTES.CITAS.BASE}/${id}/estado`,
  (id: number) => `${API_ROUTES.CITAS.DETALLES}/${id}`,
  (id: number) => `${API_ROUTES.CITAS.BASE}/${id}`,
];

type GenericRecord = Record<string, unknown>;

function asRecord(value: unknown): GenericRecord {
  return value && typeof value === "object" ? (value as GenericRecord) : {};
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeUsuario(rawDetalle: GenericRecord): GenericRecord | undefined {
  const candidatos = [
    rawDetalle.usuario,
    rawDetalle.chofer,
    rawDetalle.usuarioAsignado,
    rawDetalle.choferAsignado,
    rawDetalle.empleado,
    rawDetalle.user,
    rawDetalle.asignado,
  ];

  for (const candidato of candidatos) {
    const data = asRecord(candidato);
    if (Object.keys(data).length > 0) {
      return data;
    }
  }

  return undefined;
}

function normalizeDetalle(item: unknown) {
  const rawDetalle = asRecord(item);
  const usuario = normalizeUsuario(rawDetalle);
  const idUsuario =
    toNumber(rawDetalle.idUsuario) ??
    toNumber(usuario?.idUsuario) ??
    toNumber(usuario?.id);

  const estado =
    toText(rawDetalle.estado) ||
    toText(rawDetalle.estadoCita) ||
    toText(rawDetalle.status) ||
    "POR_ASIGNAR";

  return {
    ...rawDetalle,
    usuario,
    idUsuario,
    estado,
  };
}

function toPaginatedDetalles(payload: unknown): DetalleCitaPaginatedResponse {
  const parsedPayload = asRecord(payload);
  const content = Array.isArray(parsedPayload.content)
    ? parsedPayload.content
    : Array.isArray(payload)
      ? payload
      : [];

  const normalizedContent = content.map((item) => normalizeDetalle(item));

  if (Array.isArray(parsedPayload.content)) {
    const totalElements = toNumber(parsedPayload.totalElements) ?? normalizedContent.length;
    const size = toNumber(parsedPayload.size) ?? normalizedContent.length;
    const number = toNumber(parsedPayload.number) ?? 0;
    const numberOfElements = toNumber(parsedPayload.numberOfElements) ?? normalizedContent.length;
    const totalPages = toNumber(parsedPayload.totalPages) ?? 1;

    return {
      content: normalizedContent as DetalleCitaPaginatedResponse["content"],
      totalPages,
      totalElements,
      size,
      number,
      numberOfElements,
      first: Boolean(parsedPayload.first ?? number === 0),
      last: Boolean(parsedPayload.last ?? number + 1 >= totalPages),
      empty: Boolean(parsedPayload.empty ?? normalizedContent.length === 0),
    };
  }

  return {
    content: normalizedContent as DetalleCitaPaginatedResponse["content"],
    totalPages: 1,
    totalElements: normalizedContent.length,
    size: normalizedContent.length,
    number: 0,
    numberOfElements: normalizedContent.length,
    first: true,
    last: true,
    empty: normalizedContent.length === 0,
  };
}

export const citaService = {
  listarDetalles: async (page: number = 0, size: number = 10) => {
    const data = await getWithCache<unknown>(API_ROUTES.CITAS.DETALLES, {
      params: { page, size },
    }, 60000);

    return toPaginatedDetalles(data);
  },
  guardarCompleta: async (data: CitaCompletaRequest) => {
    const response = await api.post<string>(API_ROUTES.CITAS.GUARDAR, data);
    invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
    return response.data;
  },
  actualizarEstado: async (idDetalle: number, estado: EstadoCita | string) => {
    let lastError: unknown;

    for (const buildEndpoint of ESTADO_ENDPOINTS) {
      try {
        const response = await api.put(buildEndpoint(idDetalle), { estado });
        invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
        invalidateCacheByPrefix(API_ROUTES.CITAS.DETALLES);
        return response.data;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("No se pudo actualizar el estado de la cita");
  },
};
