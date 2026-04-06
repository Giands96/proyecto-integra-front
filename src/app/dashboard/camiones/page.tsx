"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CamionTable } from "@/modules/camiones/components/CamionTable";
import { camionService } from "@/modules/camiones/services/camionService";
import { Camion } from "@/modules/camiones/types";

const CamionFormLazy = dynamic(
  () => import("@/modules/camiones/components/CamionForm").then((mod) => mod.CamionForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function CamionesPage() {
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamion, setEditingCamion] = useState<Camion | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCamiones();
  }, []);

  async function fetchCamiones() {
    setLoading(true);
    try {
      const data = await camionService.listar();
      setCamiones(data.content);
    } catch (error) {
      console.error("Error fetching camiones:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Camion) {
    setFormLoading(true);
    try {
      if (editingCamion) {
        await camionService.actualizar(editingCamion.idCamion!, data);
      } else {
        await camionService.crear(data);
      }
      setIsDialogOpen(false);
      fetchCamiones();
    } catch (error) {
      console.error("Error saving camion:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar este camión?")) {
      try {
        await camionService.eliminar(id);
        fetchCamiones();
      } catch (error) {
        console.error("Error deleting camion:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Camiones</h1>
          <p className="text-muted-foreground">Administra tu flota de vehículos y su disponibilidad.</p>
        </div>
        <Button onClick={() => { setEditingCamion(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Camión
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CamionTable 
          camiones={camiones} 
          onEdit={(c) => { setEditingCamion(c); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingCamion ? "Editar Camión" : "Nuevo Camión"}</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <CamionFormLazy
              initialData={editingCamion}
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
