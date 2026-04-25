"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrackingResult } from "../types";
import { formatDate, formatEstado } from "../utils";

type TrackingResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TrackingResult | null;
  trackingCode: string;
};

export function TrackingResultModal({
  open,
  onOpenChange,
  result,
  trackingCode,
}: TrackingResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] bg-ransa-ink border border-white/15 text-white">
        <DialogHeader>
          <DialogTitle>
            {result?.kind === "carga" ? "Resultado de Carga" : "Resultado de Cita"}
          </DialogTitle>
        </DialogHeader>

        {result?.kind === "carga" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Código de seguimiento</p>
              <p className="font-medium">{result.data.codigoSeguimiento}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Estado</p>
              <p className="font-medium">{formatEstado(result.data.estado)}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Cliente</p>
              <p className="font-medium">{result.data.cliente}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Tipo de carga</p>
              <p className="font-medium">{result.data.tipoCarga}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3 sm:col-span-2">
              <p className="text-white/50 text-xs uppercase">Descripción</p>
              <p className="font-medium">{result.data.descripcion || "Sin descripción"}</p>
            </div>
          </div>
        ) : result?.kind === "cita" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Estado</p>
              <p className="font-medium">{formatEstado(result.data.estado)}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Fecha</p>
              <p className="font-medium">{formatDate(result.data.fechaCreacion || result.data.fechaRegistro)}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Origen</p>
              <p className="font-medium">{result.data.terminalOrigen?.nombreUbicacion || "-"}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Destino</p>
              <p className="font-medium">{result.data.terminalDestino?.nombreUbicacion || "-"}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Tipo de carga</p>
              <p className="font-medium">{result.data.carga?.tipoCarga || "-"}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <p className="text-white/50 text-xs uppercase">Seguimiento</p>
              <p className="font-medium">{result.data.carga?.codigoSeguimiento || trackingCode || "-"}</p>
            </div>
            <div className="rounded-lg border border-white/10 p-3 sm:col-span-2">
              <p className="text-white/50 text-xs uppercase">Observación</p>
              <p className="font-medium">{result.data.observacion || "Sin observaciones"}</p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
