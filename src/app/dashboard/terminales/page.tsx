"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TerminalTable } from "@/modules/terminales/components/TerminalTable";
import { TerminalForm } from "@/modules/terminales/components/TerminalForm";
import { terminalService } from "@/modules/terminales/services/terminalService";
import { Terminal } from "@/modules/terminales/types";

export default function TerminalesPage() {
  const [terminales, setTerminales] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<Terminal | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTerminales();
  }, []);

  async function fetchTerminales() {
    setLoading(true);
    try {
      const data = await terminalService.listar();
      setTerminales(data);
    } catch (error) {
      console.error("Error fetching terminales:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Terminal) {
    setFormLoading(true);
    try {
      if (editingTerminal) {
        await terminalService.actualizar(editingTerminal.idTerminal!, data);
      } else {
        await terminalService.crear(data);
      }
      setIsDialogOpen(false);
      fetchTerminales();
    } catch (error) {
      console.error("Error saving terminal:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar este terminal?")) {
      try {
        await terminalService.eliminar(id);
        fetchTerminales();
      } catch (error) {
        console.error("Error deleting terminal:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Terminales</h1>
          <p className="text-muted-foreground">Administra los puntos de origen y destino de la red logística.</p>
        </div>
        <Button onClick={() => { setEditingTerminal(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Terminal
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TerminalTable 
          terminales={terminales} 
          onEdit={(t) => { setEditingTerminal(t); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTerminal ? "Editar Terminal" : "Nuevo Terminal"}</DialogTitle>
          </DialogHeader>
          <TerminalForm 
            initialData={editingTerminal} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}