"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Cliente } from "../types";

interface ClienteTableProps {
  clientes?: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
}

export function ClienteTable({ clientes, onEdit, onDelete }: ClienteTableProps) {
  const rows = Array.isArray(clientes) ? clientes : [];

  return (
    <div className="rounded-md border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-zinc-100">
          <tr className="text-left">
            <th className="h-12 px-4 font-medium">ID</th>
            <th className="h-12 px-4 font-medium">Razon Social / Nombre</th>
            <th className="h-12 px-4 font-medium">Tipo / Documento</th>
            <th className="h-12 px-4 font-medium">Ubicacion</th>
            <th className="h-12 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((cliente) => (
            <tr key={cliente.idCliente} className="hover:bg-zinc-100/70">
              <td className="p-4">{cliente.idCliente}</td>
              <td className="p-4 font-medium">{cliente.nombresRazonSocial}</td>
              <td className="p-4">{cliente.tipoDocumento} - {cliente.numeroDocumento}</td>
              <td className="p-4">{cliente.distrito}, {cliente.provincia}, {cliente.departamento}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(cliente)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(cliente.idCliente!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="h-24 text-center text-muted-foreground">
                No hay clientes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}