import api from "@/lib/axios";
import { getWithCache, invalidateCacheByPrefix } from "@/lib/apiCache";
import { API_ROUTES } from "@/../shared/routes";
import { CitaPaginatedResponse, CitaCompletaRequest, EstadoCita } from "../types";

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

function normalizeUsuario(rawCita: GenericRecord): GenericRecord | undefined {
  const candidatos = [
    rawCita.usuario,
    rawCita.chofer,
    rawCita.usuarioAsignado,
    rawCita.choferAsignado,
    rawCita.empleado,
    rawCita.user,
    rawCita.asignado,
  ];

  for (const candidato of candidatos) {
    const data = asRecord(candidato);
    if (Object.keys(data).length > 0) {
      return data;
    }
  }

  return undefined;
}

function normalizeCita(item: unknown) {
  const rawCita = asRecord(item);
  const usuario = normalizeUsuario(rawCita);
  const idCita =
    toNumber(rawCita.idCita) ??
    toNumber(rawCita.id) ??
    0;

  const idUsuario =
    toNumber(rawCita.idUsuario) ??
    toNumber(usuario?.idUsuario) ??
    toNumber(usuario?.id);

  const estado =
    toText(rawCita.estado) ||
    toText(rawCita.estadoCita) ||
    toText(rawCita.status) ||
    "POR_ASIGNAR";

  const fechaCreacion =
    toText(rawCita.fechaCreacion) ||
    toText(rawCita.fechaRegistro) ||
    toText(rawCita.createdAt);

  const diasEstimados = toNumber(rawCita.diasEstimados) ?? 0;

  return {
    ...rawCita,
    idCita,
    usuario,
    idUsuario,
    fechaCreacion,
    diasEstimados,
    estado,
  };
}

function toPaginatedCitas(payload: unknown): CitaPaginatedResponse {
  const parsedPayload = asRecord(payload);
  const content = Array.isArray(parsedPayload.content)
    ? parsedPayload.content
    : Array.isArray(payload)
      ? payload
      : [];

  const normalizedContent = content.map((item) => normalizeCita(item));

  if (Array.isArray(parsedPayload.content)) {
    const totalElements = toNumber(parsedPayload.totalElements) ?? normalizedContent.length;
    const size = toNumber(parsedPayload.size) ?? normalizedContent.length;
    const number = toNumber(parsedPayload.number) ?? 0;
    const numberOfElements = toNumber(parsedPayload.numberOfElements) ?? normalizedContent.length;
    const totalPages = toNumber(parsedPayload.totalPages) ?? 1;

    return {
      content: normalizedContent as CitaPaginatedResponse["content"],
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
    content: normalizedContent as CitaPaginatedResponse["content"],
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
  listar: async (page: number = 0, size: number = 10) => {
    const data = await getWithCache<unknown>(API_ROUTES.CITAS.BASE, {
      params: { page, size },
    }, 60000);

    return toPaginatedCitas(data);
  },
  listarDetalles: async (page: number = 0, size: number = 10) => {
    return citaService.listar(page, size);
  },
  guardarCompleta: async (data: CitaCompletaRequest) => {
    const response = await api.post<string>(API_ROUTES.CITAS.GUARDAR, data);
    invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
    return response.data;
  },
  actualizarEstado: async (idCita: number, estado: EstadoCita | string) => {
    const endpoint = API_ROUTES.CITAS.ACTUALIZAR_ESTADO(idCita);
    let lastError: unknown;

    try {
      const response = await api.put(endpoint, { estado });
      invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
      return response.data;
    } catch (error) {
      lastError = error;
    }

    try {
      const response = await api.put(endpoint, null, {
        params: { estado },
      });
      invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
      return response.data;
    } catch (error) {
      lastError = error;
    }

    try {
      const response = await api.put(endpoint, null, {
        params: { nuevoEstado: estado },
      });
      invalidateCacheByPrefix(API_ROUTES.CITAS.BASE);
      return response.data;
    } catch (error) {
      lastError = error;
    }

    throw lastError ?? new Error("No se pudo actualizar el estado de la cita");
  },
};
