"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChoferTable } from "@/modules/choferes/components/ChoferTable";
import { choferService } from "@/modules/choferes/services/choferService";
import { Chofer } from "@/modules/choferes/types";

const ChoferFormLazy = dynamic(
  () => import("@/modules/choferes/components/ChoferForm").then((mod) => mod.ChoferForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function ChoferesPage() {
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChofer, setEditingChofer] = useState<Chofer | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchChoferes();
  }, []);

  async function fetchChoferes() {
    setLoading(true);
    try {
      const data = await choferService.listar();
      setChoferes(data.content);
    } catch (error) {
      console.error("Error fetching choferes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Chofer) {
    setFormLoading(true);
    try {
      if (editingChofer) {
        await choferService.actualizar(editingChofer.idChofer!, data);
      } else {
        await choferService.crear(data);
      }
      setIsDialogOpen(false);
      fetchChoferes();
    } catch (error) {
      console.error("Error saving chofer:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar este chofer?")) {
      try {
        await choferService.eliminar(id);
        fetchChoferes();
      } catch (error) {
        console.error("Error deleting chofer:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Choferes</h1>
          <p className="text-muted-foreground">Administra el personal de conducción y sus licencias.</p>
        </div>
        <Button onClick={() => { setEditingChofer(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Chofer
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ChoferTable 
          choferes={choferes} 
          onEdit={(c) => { setEditingChofer(c); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingChofer ? "Editar Chofer" : "Nuevo Chofer"}</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <ChoferFormLazy
              initialData={editingChofer}
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
