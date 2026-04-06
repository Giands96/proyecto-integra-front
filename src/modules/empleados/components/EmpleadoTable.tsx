"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Empleado } from "../types";

interface EmpleadoTableProps {
  empleados: Empleado[];
}

// Helper para normalizar rol a string puro
function normalizeRoleDisplay(role: unknown): string {
  if (typeof role === "string") return role;
  if (typeof role === "object" && role !== null) {
    const roleObj = role as Record<string, unknown>;
    return (roleObj.nombreRol as string) ||
           (roleObj.code as string) ||
           (roleObj.nombre as string) ||
           (roleObj.name as string) ||
           JSON.stringify(role);
  }
  return String(role || "SIN_ROL");
}

export function EmpleadoTable({ empleados }: EmpleadoTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Array.isArray(empleados) ? empleados : []).map((empleado) => (
            <TableRow key={empleado.idUsuario}>
              <TableCell>{empleado.idUsuario}</TableCell>
              <TableCell className="font-medium">{empleado.username}</TableCell>
              <TableCell>{empleado.nombres} {empleado.apellidos}</TableCell>
              <TableCell>
                <Badge variant="secondary">{normalizeRoleDisplay(empleado.role)}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {Array.isArray(empleados) && empleados.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No hay empleados registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
