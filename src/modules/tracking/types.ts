export interface TrackingTerminal {
  nombreUbicacion: string;
}

export interface TrackingCargaSimple {
  tipoCarga?: string;
  codigoSeguimiento?: string;
}

export interface TrackingCargaResult {
  codigoSeguimiento: string;
  tipoCarga: string;
  descripcion?: string;
  estado: string;
  cliente: string;
}

export interface TrackingCitaResult {
  estado: string;
  terminalOrigen?: TrackingTerminal;
  terminalDestino?: TrackingTerminal;
  carga?: TrackingCargaSimple;
  fechaRegistro?: string;
  fechaCreacion?: string;
  observacion?: string;
}

export type TrackingResult =
  | { kind: "carga"; data: TrackingCargaResult }
  | { kind: "cita"; data: TrackingCitaResult };
