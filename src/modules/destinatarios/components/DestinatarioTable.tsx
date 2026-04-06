"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Destinatario } from "../types";

interface DestinatarioTableProps {
  destinatarios?: Destinatario[];
  onEdit: (destinatario: Destinatario) => void;
  onDelete: (id: number) => void;
}

export function DestinatarioTable({ destinatarios, onEdit, onDelete }: DestinatarioTableProps) {
  const rows = Array.isArray(destinatarios) ? destinatarios : [];

  return (
    <div className="rounded-md border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-zinc-100">
          <tr className="text-left">
            <th className="h-12 px-4 font-medium">ID</th>
            <th className="h-12 px-4 font-medium">Nombre</th>
            <th className="h-12 px-4 font-medium">Documento</th>
            <th className="h-12 px-4 font-medium">Telefono</th>
            <th className="h-12 px-4 font-medium">Ubicacion</th>
            <th className="h-12 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((destinatario) => (
            <tr key={destinatario.idDestinatario} className="hover:bg-zinc-100/70">
              <td className="p-4">{destinatario.idDestinatario}</td>
              <td className="p-4 font-medium">{destinatario.nombreCompleto}</td>
              <td className="p-4">{destinatario.tipoDocumento} - {destinatario.numeroDocumento}</td>
              <td className="p-4">{destinatario.telefono}</td>
              <td className="p-4">{destinatario.distrito}, {destinatario.provincia}, {destinatario.departamento}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(destinatario)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(destinatario.idDestinatario!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="h-24 text-center text-muted-foreground">
                No hay destinatarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}