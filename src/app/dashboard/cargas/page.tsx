"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CargaTable } from "@/modules/cargas/components/CargaTable";
import { CargaForm } from "@/modules/cargas/components/CargaForm";
import { cargaService } from "@/modules/cargas/services/cargaService";
import { Carga } from "@/modules/cargas/types";

export default function CargasPage() {
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarga, setEditingCarga] = useState<Carga | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCargas();
  }, []);

  async function fetchCargas() {
    setLoading(true);
    try {
      const data = await cargaService.listar();
      setCargas(data);
    } catch (error) {
      console.error("Error fetching cargas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Carga) {
    setFormLoading(true);
    try {
      if (editingCarga) {
        await cargaService.actualizar(editingCarga.idCarga!, data);
      } else {
        await cargaService.crear(data);
      }
      setIsDialogOpen(false);
      fetchCargas();
    } catch (error) {
      console.error("Error saving carga:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar esta carga?")) {
      try {
        await cargaService.eliminar(id);
        fetchCargas();
      } catch (error) {
        console.error("Error deleting carga:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Cargas</h1>
          <p className="text-muted-foreground">Administra los tipos de carga y sus códigos de seguimiento.</p>
        </div>
        <Button onClick={() => { setEditingCarga(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Carga
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CargaTable 
          cargas={cargas} 
          onEdit={(c) => { setEditingCarga(c); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingCarga ? "Editar Carga" : "Nueva Carga"}</DialogTitle>
          </DialogHeader>
          <CargaForm 
            initialData={editingCarga} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}