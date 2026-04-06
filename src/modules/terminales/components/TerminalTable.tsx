"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { Terminal } from "../types";

interface TerminalTableProps {
  terminales: Terminal[];
  onEdit: (terminal: Terminal) => void;
  onDelete: (id: number) => void;
}

export function TerminalTable({ terminales, onEdit, onDelete }: TerminalTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Ubicación / Sede</TableHead>
            <TableHead>Distrito</TableHead>
            <TableHead>Provincia / Depto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terminales.map((terminal) => (
            <TableRow key={terminal.idTerminal} className="hover:bg-zinc-100/70">
              <TableCell>{terminal.idTerminal}</TableCell>
              <TableCell className="font-medium">{terminal.nombreUbicacion}</TableCell>
              <TableCell>{terminal.distrito}</TableCell>
              <TableCell>{terminal.provincia}, {terminal.departamento}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(terminal)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(terminal.idTerminal!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {terminales.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No hay terminales registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}