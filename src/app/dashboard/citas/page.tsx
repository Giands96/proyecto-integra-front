"use client";
import React from "react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CitaTable } from "@/modules/citas/components/CitaTable";
import { citaService } from "@/modules/citas/services/citaService";
import { Cita } from "@/modules/citas/types";

const CitaFormLazy = dynamic(
  () => import("@/modules/citas/components/CitaForm").then((mod) => mod.CitaForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario...</p>,
  }
);

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [estadoActualizandoId, setEstadoActualizandoId] = useState<number | null>(null);

  // Función para mostrar texto o un valor de fallback
  // fallback es útil para mostrar "-" en caso de que el valor sea null,
  //  undefined o una cadena vacía
  function textOrFallback(value: unknown, fallback = "-") {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
    return fallback;
  }

  function formatDate(value: string | undefined) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  function getNombreChofer(cita: Cita) {
    const rawUsuario = cita.usuario as unknown as Record<string, unknown> | undefined;
    const nombres = textOrFallback(rawUsuario?.nombres, "");
    const apellidos = textOrFallback(rawUsuario?.apellidos, "");
    const fullName = `${nombres} ${apellidos}`.trim();

    if (fullName) {
      return fullName;
    }

    return textOrFallback(rawUsuario?.username ?? rawUsuario?.usuario, "No asignado");
  }

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
      const data = await citaService.listar();
      setCitas(data.content);
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

  async function handleEstadoChange(idCita: number, estado: string) {
    // Actualización optimista: el badge cambia inmediatamente
    setCitas((prev) =>
      prev.map((cita) => (cita.idCita === idCita ? { ...cita, estado } : cita))
    );

    setEstadoActualizandoId(idCita);
    try {
      await citaService.actualizarEstado(idCita, estado);
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
          citas={citas}
          onEstadoChange={handleEstadoChange}
          onViewDetail={(cita) => setSelectedCita(cita)}
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

      <Dialog open={Boolean(selectedCita)} onOpenChange={(open) => !open && setSelectedCita(null)}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Detalle de Cita</DialogTitle>
          </DialogHeader>
          {selectedCita ? (
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">ID cita</p>
                <p className="font-medium">{selectedCita.idCita}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Estado</p>
                <p className="font-medium">{textOrFallback(selectedCita.estado)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Cliente</p>
                <p className="font-medium">{textOrFallback(selectedCita.cliente?.nombresRazonSocial)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Destinatario</p>
                <p className="font-medium">{textOrFallback(selectedCita.destinatario?.nombreCompleto)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Fecha de creación</p>
                <p className="font-medium">{formatDate(selectedCita.fechaCreacion)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Fecha de llegada</p>
                <p className="font-medium">{formatDate(selectedCita.fechaLlegada)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Origen</p>
                <p className="font-medium">{textOrFallback(selectedCita.terminalOrigen?.nombreUbicacion)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Destino</p>
                <p className="font-medium">{textOrFallback(selectedCita.terminalDestino?.nombreUbicacion)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Chofer</p>
                <p className="font-medium">{getNombreChofer(selectedCita)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Camión</p>
                <p className="font-medium">{textOrFallback(selectedCita.camion?.placa)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full  ">Carga</p>
                <p className="font-medium">{textOrFallback(selectedCita.carga?.tipoCarga)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Seguimiento</p>
                <p className="font-medium">{textOrFallback(selectedCita.carga?.codigoSeguimiento)}</p>
              </div>

              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Días estimados</p>
                <p className="font-medium">{textOrFallback(selectedCita.diasEstimados)}</p>
              </div>
              <div className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs uppercase text-muted-foreground bg-neutral-700 text-white w-fit px-2 py-1 font-semibold rounded-full">Observación</p>
                <p className="font-medium">{textOrFallback(selectedCita.observacion, "Sin observaciones")}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}