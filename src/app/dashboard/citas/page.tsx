"use client";
import React from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CitaTable } from "@/modules/citas/components/CitaTable";
import { citaService } from "@/modules/citas/services/citaService";
import { DetalleCita } from "@/modules/citas/types";

const CitaFormLazy = dynamic(
  () => import("@/modules/citas/components/CitaForm").then((mod) => mod.CitaForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function CitasPage() {
  const [detalles, setDetalles] = useState<DetalleCita[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [estadoActualizandoId, setEstadoActualizandoId] = useState<number | null>(null);

  useEffect(() => {
    fetchCitas(true);
  }, []);

  async function fetchCitas(isInitial = false) {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const data = await citaService.listarDetalles();
      setDetalles(data.content);
    } catch (error) {
      console.error("Error fetching citas:", error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }

  async function handleSubmit(data: Parameters<typeof citaService.guardarCompleta>[0]) {
    setFormLoading(true);
    try {
      await citaService.guardarCompleta(data);
      setIsDialogOpen(false);
      await fetchCitas();
    } catch (error) {
      console.error("Error saving cita:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEstadoChange(idDetalle: number, estado: string) {
    // Actualización optimista: el badge cambia inmediatamente
    setDetalles((prev) =>
      prev.map((d) => (d.idDetalle === idDetalle ? { ...d, estado } : d))
    );

    setEstadoActualizandoId(idDetalle);
    try {
      await citaService.actualizarEstado(idDetalle, estado);
      await fetchCitas(); // sincroniza con el backend sin ocultar la tabla
    } catch (error) {
      console.error("Error updating cita estado:", error);
      await fetchCitas(); // revierte al estado real si falló
    } finally {
      setEstadoActualizandoId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas Logísticas</h1>
          <p className="text-muted-foreground">
            Programa envíos, asigna personal y monitorea el estado de la carga.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchCitas()}
            disabled={refreshing || initialLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Programar Cita
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CitaTable
          detalles={detalles}
          onEstadoChange={handleEstadoChange}
          updatingEstadoId={estadoActualizandoId}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nueva Cita Logística</DialogTitle>
          </DialogHeader>
          {isDialogOpen ? (
            <CitaFormLazy
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