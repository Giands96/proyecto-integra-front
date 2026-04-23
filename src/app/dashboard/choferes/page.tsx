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
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    try {
      await choferService.actualizar(editingChofer.idUsuario, data);
      setIsDialogOpen(false);
      setEditingChofer(null);
      fetchChoferes();
    } catch (error) {
      console.error("Error saving chofer:", error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setSubmitError("No tienes permisos para actualizar choferes. Esta acción requiere rol ADMINISTRADOR.");
      } else {
        setSubmitError("No se pudo actualizar el chofer. Intenta nuevamente.");
      }
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
          onEdit={(c) => {
            setSubmitError(null);
            setEditingChofer(c);
            setIsDialogOpen(true);
          }}
        />
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSubmitError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Editar Chofer</DialogTitle>
          </DialogHeader>
          {submitError ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {submitError}
            </p>
          ) : null}
          {isDialogOpen && editingChofer ? (
            <ChoferFormLazy
              initialData={editingChofer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingChofer(null);
                setSubmitError(null);
              }}
              loading={formLoading}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
