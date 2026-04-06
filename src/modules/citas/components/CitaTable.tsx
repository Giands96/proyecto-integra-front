"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DetalleCita } from "../types";

export function CitaTable({ detalles }: { detalles: DetalleCita[] }) {
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "POR_ASIGNAR": return "secondary";
      case "PROGRAMADO": return "default";
      case "EN_CAMINO": return "outline";
      case "ENTREGADO": return "outline";
      default: return "default";
    }
  };

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {detalles.map((d) => (
            <TableRow key={d.idDetalle}>
              <TableCell>{d.idDetalle}</TableCell>
              <TableCell className="font-medium">{d.cliente.nombresRazonSocial}</TableCell>
              <TableCell>{d.terminalOrigen.nombreUbicacion} ? {d.terminalDestino?.nombreUbicacion || "-"}</TableCell>
              <TableCell>
                <div>{d.carga.tipoCarga}</div>
                <div className="text-xs text-muted-foreground">{d.carga.codigoSeguimiento}</div>
              </TableCell>
              <TableCell>
                <div>{d.chofer?.nombresCompletos || "No asignado"}</div>
                <div className="text-xs text-muted-foreground">{d.camion?.placa || "-"}</div>
              </TableCell>
              <TableCell><Badge variant={getBadgeVariant(d.estado)}>{d.estado}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}