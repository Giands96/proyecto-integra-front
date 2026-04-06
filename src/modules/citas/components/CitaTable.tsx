"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DetalleCita } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ESTADOS = ["POR_ASIGNAR", "PROGRAMADO", "EN_CAMINO", "ENTREGADO", "CANCELADO"] as const;

const ESTADO_LABELS: Record<(typeof ESTADOS)[number], string> = {
  POR_ASIGNAR: "Por asignar",
  PROGRAMADO: "Programado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

function normalizeEstado(estado: string) {
  return estado?.trim().toUpperCase() || "POR_ASIGNAR";
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getNombreUsuario(usuario: unknown) {
  if (!usuario || typeof usuario !== "object") {
    return "";
  }

  const data = usuario as Record<string, unknown>;
  const nombres = toText(data.nombres);
  const apellidos = toText(data.apellidos);
  const username = toText(data.username ?? data.usuario);
  const nombreCompleto = `${nombres} ${apellidos}`.trim();

  return nombreCompleto || username;
}

function getEstadoBadgeClass(estado: string) {
  switch (normalizeEstado(estado)) {
    case "POR_ASIGNAR":
      return "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100";
    case "PROGRAMADO":
      return "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "EN_CAMINO":
      return "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "ENTREGADO":
      return "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "CANCELADO":
      return "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-100";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-100";
  }
}

function getChoferLabel(detalle: DetalleCita) {
  const posibleChoferes = [
    detalle.usuario,
    (detalle as unknown as Record<string, unknown>).usuarioAsignado,
    (detalle as unknown as Record<string, unknown>).choferAsignado,
    (detalle as unknown as Record<string, unknown>).empleado,
    (detalle as unknown as Record<string, unknown>).user,
    (detalle as unknown as Record<string, unknown>).asignado,
  ];

  for (const posibleChofer of posibleChoferes) {
    const label = getNombreUsuario(posibleChofer);
    if (label) {
      return label;
    }
  }

  const detalleCrudo = detalle as unknown as Record<string, unknown>;
  const idUsuario = detalleCrudo.idUsuario ?? detalleCrudo.idChofer;

  if (typeof idUsuario === "number" || typeof idUsuario === "string") {
    return `Chofer #${idUsuario}`;
  }

  return detalle.idUsuario ? `Usuario #${detalle.idUsuario}` : "No asignado";
}

interface CitaTableProps {
  detalles: DetalleCita[];
  onEstadoChange: (idDetalle: number, estado: string) => void;
  updatingEstadoId?: number | null;
}

export function CitaTable({ detalles, onEstadoChange, updatingEstadoId }: CitaTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Ruta (Origen - Destino)</TableHead>
            <TableHead>Carga (Seguimiento)</TableHead>
            <TableHead>Chofer / Camión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Modificar estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detalles.map((d) => (
            <TableRow key={d.idDetalle}>
              <TableCell>{d.idDetalle}</TableCell>
              <TableCell className="font-medium">{d.cliente.nombresRazonSocial}</TableCell>
              <TableCell>
                {d.terminalOrigen.nombreUbicacion} - {d.terminalDestino?.nombreUbicacion || "-"}
              </TableCell>
              <TableCell>
                <div>{d.carga.tipoCarga}</div>
                <div className="text-xs text-muted-foreground">{d.carga.codigoSeguimiento}</div>
              </TableCell>
              <TableCell>
                <div>{getChoferLabel(d)}</div>
                <div className="text-xs text-muted-foreground">{d.camion?.placa || "-"}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getEstadoBadgeClass(d.estado)}>
                  {ESTADO_LABELS[normalizeEstado(d.estado) as (typeof ESTADOS)[number]] ?? d.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={normalizeEstado(d.estado)}
                  onValueChange={(value) => onEstadoChange(d.idDetalle, value ?? "POR_ASIGNAR")}
                  disabled={updatingEstadoId === d.idDetalle}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Cambiar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {ESTADO_LABELS[estado]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}