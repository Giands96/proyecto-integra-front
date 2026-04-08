"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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



function getEstadoLabel(estado: string) {
  const key = normalizeEstado(estado) as (typeof ESTADOS)[number];
  return ESTADO_LABELS[key] || toText(estado) || "Desconocido";
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
              <TableCell className="font-medium">
                {d.cliente.nombresRazonSocial}
              </TableCell>
              <TableCell>
                {d.terminalOrigen.nombreUbicacion} -{" "}
                {d.terminalDestino?.nombreUbicacion || "-"}
              </TableCell>
              <TableCell>
                <div>{d.carga.tipoCarga}</div>
                <div className="text-xs text-muted-foreground">
                  {d.carga.codigoSeguimiento}
                </div>
              </TableCell>
              <TableCell>
                <div>{getChoferLabel(d)}</div>
                <div className="text-xs text-muted-foreground">
                  {d.camion?.placa || "-"}
                </div>
              </TableCell>
              <TableCell>
                {(() => {
                  // Diccionario de colores (¡Adiós a los problemas del Badge!)
                  const coloresPorEstado: Record<string, string> = {
                    POR_ASIGNAR: "border-slate-300 bg-slate-200 text-slate-800",
                    PROGRAMADO: "border-blue-300 bg-blue-200 text-blue-800",
                    EN_CAMINO: "border-amber-300 bg-amber-200 text-amber-900",
                    ENTREGADO: "border-emerald-300 bg-emerald-200 text-emerald-800",
                    CANCELADO: "border-rose-300 bg-rose-200 text-rose-800",
                  };

                  const estadoActual = normalizeEstado(d.estado);
                  const clasesColor = coloresPorEstado[estadoActual] || "border-zinc-300 bg-zinc-200 text-zinc-800";

                  return (
                    <div className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${clasesColor}`}>
                      {getEstadoLabel(d.estado)}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <Select
                  value={normalizeEstado(d.estado)}
                  onValueChange={(value) =>
                    onEstadoChange(d.idDetalle, value ?? "POR_ASIGNAR")
                  }
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