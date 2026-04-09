"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Carga } from "../types";

// 1. Definición de Estados y Etiquetas
const ESTADOS_CARGA = ["PENDIENTE", "EN_TRANSITO", "ENTREGADA", "CANCELADA"] as const;

const ESTADO_LABELS: Record<(typeof ESTADOS_CARGA)[number], string> = {
  PENDIENTE: "Pendiente",
  EN_TRANSITO: "En Tránsito",
  ENTREGADA: "Entregada",
  CANCELADA: "Cancelada",
};

// 2. Funciones Auxiliares para normalización y colores
function normalizeEstado(estado: string) {
  return estado?.trim().toUpperCase() || "PENDIENTE";
}

function getEstadoBadgeClass(estado: string) {
  switch (normalizeEstado(estado)) {
    case "PENDIENTE":
      return "border-slate-300 bg-slate-200 text-slate-800";
    case "EN_TRANSITO":
      return "border-blue-300 bg-blue-200 text-blue-800";
    case "ENTREGADA":
      return "border-emerald-300 bg-emerald-200 text-emerald-800";
    case "CANCELADA":
      return "border-rose-300 bg-rose-200 text-rose-800";
    default:
      return "border-zinc-300 bg-zinc-200 text-zinc-800";
  }
}

// 3. Definición de Props (incluyendo las nuevas para el estado)
interface CargaTableProps {
  cargas: Carga[];
  onEdit: (carga: Carga) => void;
  onDelete: (id: number) => void;
  onEstadoChange: (idCarga: number, estado: string) => void;
  updatingEstadoId?: number | null;
}

// 4. Componente Principal
export function CargaTable({ 
  cargas, 
  onEdit, 
  onDelete, 
  onEstadoChange, 
  updatingEstadoId 
}: CargaTableProps) {
  
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Seguimiento</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Modificar Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No hay cargas registradas.
              </TableCell>
            </TableRow>
          ) : (
            cargas.map((carga) => {
              const estadoActual = normalizeEstado(carga.estado);
              const colorClases = getEstadoBadgeClass(estadoActual);
              
              return (
                <TableRow key={carga.idCarga} className="hover:bg-zinc-50 transition-colors">
                  <TableCell className="font-medium text-muted-foreground">
                    #{carga.idCarga}
                  </TableCell>
                  
                  <TableCell className="font-semibold text-zinc-900">
                    {carga.codigoSeguimiento || "N/A"}
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{carga.tipoCarga}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={carga.descripcionCarga}>
                      {carga.descripcionCarga}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-zinc-600">
                    {String(carga.cliente?.nombresRazonSocial || "No asignado")}
                  </TableCell>
                  
                  <TableCell>
                    {/* Badge de estado usando div nativo para evitar conflictos de Shadcn */}
                    <div className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${colorClases}`}>
                      {ESTADO_LABELS[estadoActual as keyof typeof ESTADO_LABELS] || estadoActual}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      value={estadoActual}
                      onValueChange={(value) => onEstadoChange(carga.idCarga!, value!)}
                      disabled={updatingEstadoId === carga.idCarga}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Cambiar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS_CARGA.map((estado) => (
                          <SelectItem key={estado} value={estado} className="text-xs">
                            {ESTADO_LABELS[estado]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => onEdit(carga)}
                        title="Editar Carga"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => onDelete(carga.idCarga!)}
                        title="Eliminar Carga"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}