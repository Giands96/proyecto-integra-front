"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cita } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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

function getChoferLabel(cita: Cita) {
  const posibleChoferes = [
    cita.usuario,
    (cita as unknown as Record<string, unknown>).usuarioAsignado,
    (cita as unknown as Record<string, unknown>).choferAsignado,
    (cita as unknown as Record<string, unknown>).empleado,
    (cita as unknown as Record<string, unknown>).user,
    (cita as unknown as Record<string, unknown>).asignado,
  ];

  for (const posibleChofer of posibleChoferes) {
    const label = getNombreUsuario(posibleChofer);
    if (label) {
      return label;
    }
  }

  const citaCruda = cita as unknown as Record<string, unknown>;
  const idUsuario = citaCruda.idUsuario ?? citaCruda.idChofer;

  if (typeof idUsuario === "number" || typeof idUsuario === "string") {
    return `Chofer #${idUsuario}`;
  }

  return typeof citaCruda.idUsuario === "number" ? `Usuario #${citaCruda.idUsuario}` : "No asignado";
}



interface CitaTableProps {
  citas: Cita[];
  onEstadoChange: (idCita: number, estado: string) => void;
  onViewDetail: (cita: Cita) => void;
  updatingEstadoId?: number | null;
}

export function CitaTable({ citas, onEstadoChange, onViewDetail, updatingEstadoId }: CitaTableProps) {
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
            <TableHead className="text-right">Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {citas.map((cita) => (
            <TableRow key={cita.idCita}>
              <TableCell>{cita.idCita}</TableCell>
              <TableCell className="font-medium">
                {cita.cliente.nombresRazonSocial}
              </TableCell>
              <TableCell>
                {cita.terminalOrigen.nombreUbicacion} -{" "}
                {cita.terminalDestino?.nombreUbicacion || "-"}
              </TableCell>
              <TableCell>
                <div>{cita.carga.tipoCarga}</div>
                <div className="text-xs text-muted-foreground">
                  {cita.carga.codigoSeguimiento}
                </div>
              </TableCell>
              <TableCell>
                <div>{getChoferLabel(cita)}</div>
                <div className="text-xs text-muted-foreground">
                  {cita.camion?.placa || "-"}
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

                  const estadoActual = normalizeEstado(cita.estado);
                  const clasesColor = coloresPorEstado[estadoActual] || "border-zinc-300 bg-zinc-200 text-zinc-800";

                  return (
                    <div className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${clasesColor}`}>
                      {getEstadoLabel(cita.estado)}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                <Select
                  value={normalizeEstado(cita.estado)}
                  onValueChange={(value) =>
                    onEstadoChange(cita.idCita, value ?? "POR_ASIGNAR")
                  }
                  disabled={updatingEstadoId === cita.idCita}
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
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(cita)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}