"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DestinatarioTable } from "@/modules/destinatarios/components/DestinatarioTable";
import { destinatarioService } from "@/modules/destinatarios/services/destinatarioService";
import { Destinatario } from "@/modules/destinatarios/types";

const DestinatarioFormLazy = dynamic(
  () => import("@/modules/destinatarios/components/DestinatarioForm").then((mod) => mod.DestinatarioForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function DestinatariosPage() {
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestinatario, setEditingDestinatario] = useState<Destinatario | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchDestinatarios();
  }, []);

  async function fetchDestinatarios() {
    setLoading(true);
    try {
      const data = await destinatarioService.listar();
      setDestinatarios(Array.isArray(data.content) ? data.content : []);
    } catch (error) {
      console.error("Error fetching destinatarios:", error);
      setDestinatarios([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Destinatario) {
    setFormLoading(true);
    try {
      if (editingDestinatario) {
        await destinatarioService.actualizar(editingDestinatario.idDestinatario!, data);
      } else {
        await destinatarioService.crear(data);
      }
      setIsDialogOpen(false);
      fetchDestinatarios();
    } catch (error) {
      console.error("Error saving destinatario:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar este destinatario?")) {
      try {
        await destinatarioService.eliminar(id);
        fetchDestinatarios();
      } catch (error) {
        console.error("Error deleting destinatario:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Destinatarios</h1>
          <p className="text-muted-foreground">Administra la base de datos de destinatarios de entregas.</p>
        </div>
        <Button onClick={() => { setEditingDestinatario(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Destinatario
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DestinatarioTable 
          destinatarios={destinatarios} 
          onEdit={(d) => { setEditingDestinatario(d); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingDestinatario ? "Editar Destinatario" : "Nuevo Destinatario"}</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <DestinatarioFormLazy
              initialData={editingDestinatario}
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