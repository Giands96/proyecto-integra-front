"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Chofer } from "../types";
import { useAuthStore } from "@/store/authStore";

interface ChoferTableProps {
  choferes: Chofer[];
  onEdit: (chofer: Chofer) => void;
}

export function ChoferTable({ choferes, onEdit }: ChoferTableProps) {
  const role = useAuthStore((state) => state.role);
  const isOperador = (role || "").toUpperCase().includes("OPERADOR");

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(choferes || []).map((chofer) => (
            <TableRow key={chofer.idUsuario} className="hover:bg-zinc-100/70">
              <TableCell>{chofer.idUsuario}</TableCell>
              <TableCell className="font-medium">{`${chofer.nombres} ${chofer.apellidos}`}</TableCell>
              <TableCell>{chofer.username}</TableCell>
              <TableCell>
                <Badge variant="default">
                  {chofer.rol}
                </Badge>
              </TableCell>
              <TableCell>{chofer.fechaCreacion ? new Date(chofer.fechaCreacion).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(chofer)}
                    disabled={isOperador}
                    title={isOperador ? "Operador no puede editar chofer" : "Editar chofer"}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {choferes.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No hay choferes registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}