"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmpleadoTable } from "@/modules/empleados/components/EmpleadoTable";
import { empleadoService } from "@/modules/empleados/services/empleadoService";
import { CrearEmpleadoPayload, Empleado } from "@/modules/empleados/types";

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

  async function handleSubmit(data: CrearEmpleadoPayload) {
    setFormLoading(true);
    try {
      await empleadoService.crear(data);
      setIsDialogOpen(false);
      fetchEmpleados();
    } catch (error) {
      console.error("Error creating empleado:", error);
    } finally {
      setFormLoading(false);
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
        <EmpleadoTable empleados={empleados} />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <EmpleadoFormLazy
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              loading={formLoading}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
