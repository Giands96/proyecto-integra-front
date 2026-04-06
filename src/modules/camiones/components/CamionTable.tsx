"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Camion } from "../types";

interface CamionTableProps {
  camiones: Camion[];
  onEdit: (camion: Camion) => void;
  onDelete: (id: number) => void;
}

export function CamionTable({ camiones, onEdit, onDelete }: CamionTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {camiones.map((camion) => (
            <TableRow key={camion.idCamion} className="hover:bg-zinc-100/70">
              <TableCell>{camion.idCamion}</TableCell>
              <TableCell className="font-medium">{camion.placa}</TableCell>
              <TableCell>
                <Badge variant={camion.disponibilidad === 1 ? "default" : "destructive"}>
                  {camion.disponibilidad === 1 ? "Disponible" : "No Disponible"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(camion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(camion.idCamion!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {camiones.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No hay camiones registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}