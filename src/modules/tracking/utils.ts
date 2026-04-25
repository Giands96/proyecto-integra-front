const ESTADO_LABELS: Record<string, string> = {
  POR_ASIGNAR: "Por asignar",
  PROGRAMADO: "Programado",
  EN_CAMINO: "En camino",
  EN_TRANSITO: "En tránsito",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  PENDIENTE: "Pendiente",
};

export function formatEstado(estado?: string) {
  if (!estado) {
    return "Sin estado";
  }

  return ESTADO_LABELS[estado] ?? estado;
}

export function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const maybeResponse = (error as { response?: { status?: unknown } }).response;
  return typeof maybeResponse?.status === "number" ? maybeResponse.status : undefined;
}
