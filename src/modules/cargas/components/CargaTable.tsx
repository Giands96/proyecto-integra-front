"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Carga } from "../types";

interface CargaTableProps {
  cargas: Carga[];
  onEdit: (carga: Carga) => void;
  onDelete: (id: number) => void;
}

export function CargaTable({ cargas, onEdit, onDelete }: CargaTableProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Código copiado: " + text);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Código Seguimiento</TableHead>
            <TableHead>Tipo Carga</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargas.map((carga) => (
            <TableRow key={carga.idCarga} className="hover:bg-zinc-100/70">
              <TableCell>{carga.idCarga}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{carga.codigoSeguimiento || "N/A"}</Badge>
                  {carga.codigoSeguimiento && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(carga.codigoSeguimiento!)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{carga.tipoCarga}</TableCell>
              <TableCell className="max-w-xs truncate">{carga.descripcionCarga}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(carga)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(carga.idCarga!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {cargas.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No hay cargas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}