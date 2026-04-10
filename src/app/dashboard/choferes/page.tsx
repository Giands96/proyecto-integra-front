"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChoferTable } from "@/modules/choferes/components/ChoferTable";
import { choferService } from "@/modules/choferes/services/choferService";
import { Chofer, ChoferUpdatePayload } from "@/modules/choferes/types";


const ChoferFormLazy = dynamic(
  () => import("@/modules/choferes/components/ChoferForm").then((mod) => ({ default: mod.ChoferForm })),
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
      setChoferes(Array.isArray(data.content) ? data.content : []);
    } catch (error) {
      console.error("Error fetching choferes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: ChoferUpdatePayload) {
    if (!editingChofer?.idUsuario) {
      return;
    }

    setFormLoading(true);
    try {
      await choferService.actualizar(editingChofer.idUsuario, data);
      setIsDialogOpen(false);
      setEditingChofer(null);
      fetchChoferes();
    } catch (error) {
      console.error("Error saving chofer:", error);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Choferes</h1>
          <p className="text-muted-foreground">Visualiza usuarios con rol CHOFER y edita sus datos.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ChoferTable 
          choferes={choferes} 
          onEdit={(c) => { setEditingChofer(c); setIsDialogOpen(true); }}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Editar Chofer</DialogTitle>
          </DialogHeader>
          {isDialogOpen && editingChofer ? (
            <ChoferFormLazy
              initialData={editingChofer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingChofer(null);
              }}
              loading={formLoading}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
