"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmpleadoTable } from "@/modules/empleados/components/EmpleadoTable";
import { empleadoService } from "@/modules/empleados/services/empleadoService";
import { CrearEmpleadoPayload, ActualizarEmpleadoPayload, Empleado } from "@/modules/empleados/types";

const EmpleadoFormLazy = dynamic(
  () => import("@/modules/empleados/components/EmpleadoForm").then((mod) => mod.EmpleadoForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | undefined>();

  useEffect(() => {
    fetchEmpleados();
  }, []);

  async function fetchEmpleados() {
    setLoading(true);
    try {
      const data = await empleadoService.listar();
      setEmpleados(data.content);
    } catch (error) {
      console.error("Error fetching empleados:", error);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: CrearEmpleadoPayload | ActualizarEmpleadoPayload) {
    setFormLoading(true);
    try {
      if (editingEmpleado) {
        await empleadoService.actualizar(editingEmpleado.idUsuario, data as ActualizarEmpleadoPayload);
      } else {
        await empleadoService.crear(data as CrearEmpleadoPayload);
      }
      setIsDialogOpen(false);
      setEditingEmpleado(undefined);
      fetchEmpleados();
    } catch (error) {
      console.error("Error saving empleado:", error);
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(empleado: Empleado) {
    setEditingEmpleado(empleado);
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setEditingEmpleado(undefined);
  }

  function handleDelete(idUsuario: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      console.log("Eliminar empleado:", idUsuario);
      // TODO: Implementar eliminación cuando el backend lo soporte
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de Empleados</h1>
          <p className="text-muted-foreground">Registra y consulta usuarios del sistema.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <EmpleadoTable empleados={empleados} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingEmpleado ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <EmpleadoFormLazy
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              loading={formLoading}
              editingEmpleado={editingEmpleado}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
