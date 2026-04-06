"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClienteTable } from "@/modules/clientes/components/ClienteTable";
import { ClienteForm } from "@/modules/clientes/components/ClienteForm";
import { clienteService } from "@/modules/clientes/services/clienteService";
import { Cliente } from "@/modules/clientes/types";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    try {
      const data = await clienteService.listar();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Cliente) {
    setFormLoading(true);
    try {
      if (editingCliente) {
        await clienteService.actualizar(editingCliente.idCliente!, data);
      } else {
        await clienteService.crear(data);
      }
      setIsDialogOpen(false);
      fetchClientes();
    } catch (error) {
      console.error("Error saving cliente:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await clienteService.eliminar(id);
        fetchClientes();
      } catch (error) {
        console.error("Error deleting cliente:", error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra la base de datos de tus clientes corporativos y personales.</p>
        </div>
        <Button onClick={() => { setEditingCliente(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ClienteTable 
          clientes={clientes} 
          onEdit={(c) => { setEditingCliente(c); setIsDialogOpen(true); }}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <ClienteForm 
            initialData={editingCliente} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}