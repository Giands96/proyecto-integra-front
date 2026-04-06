"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { clienteService } from "@/modules/clientes/services/clienteService";
import { destinatarioService } from "@/modules/destinatarios/services/destinatarioService";
import { terminalService } from "@/modules/terminales/services/terminalService";
import { cargaService } from "@/modules/cargas/services/cargaService";
import { choferService } from "@/modules/choferes/services/choferService";
import { camionService } from "@/modules/camiones/services/camionService";
import { CitaCompletaRequest } from "../types";
import { Cliente } from "@/modules/clientes/types";
import { Destinatario } from "@/modules/destinatarios/types";
import { Terminal } from "@/modules/terminales/types";
import { Carga } from "@/modules/cargas/types";
import { Chofer } from "@/modules/choferes/types";
import { Camion } from "@/modules/camiones/types";
import { citaSchema } from "../schemas";

type CitaFormValues = z.infer<typeof citaSchema>;
type CitaFormInput = z.input<typeof citaSchema>;

type CitaFormData = {
  clientes: Cliente[];
  destinatarios: Destinatario[];
  terminales: Terminal[];
  cargas: Carga[];
  choferes: Chofer[];
  camiones: Camion[];
};

export function CitaForm({ onSubmit, onCancel, loading }: { onSubmit: (data: CitaCompletaRequest) => void; onCancel: () => void; loading: boolean }) {
  const [data, setData] = useState<CitaFormData>({
    clientes: [], destinatarios: [], terminales: [], cargas: [], choferes: [], camiones: []
  });
  const [isLoadingCatalogos, setIsLoadingCatalogos] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cl, de, te, ca, ch, cm] = await Promise.all([
          clienteService.listar(),
          destinatarioService.listar(),
          terminalService.listar(),
          cargaService.listar(),
          choferService.listar(),
          camionService.listar()
        ]);

        setData({
          clientes: Array.isArray(cl.content) ? cl.content : [],
          destinatarios: Array.isArray(de.content) ? de.content : [],
          terminales: Array.isArray(te.content) ? te.content : [],
          cargas: Array.isArray(ca.content) ? ca.content : [],
          choferes: Array.isArray(ch.content) ? ch.content : [],
          camiones: Array.isArray(cm.content) ? cm.content : [],
        });
      } catch (error) {
        console.error("Error cargando catálogos de cita:", error);
        setData({ clientes: [], destinatarios: [], terminales: [], cargas: [], choferes: [], camiones: [] });
      } finally {
        setIsLoadingCatalogos(false);
      }
    }

    loadData();
  }, []);

  const form = useForm<CitaFormInput, unknown, CitaFormValues>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      idCliente: 0, idDestinatario: 0, idTerminalOrigen: 0,
      idCarga: 0, observacion: ""
    } as CitaFormInput
  });

  if (isLoadingCatalogos) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Cargando datos...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idCliente" render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>
                  {data.clientes.map((c) => (
                    <SelectItem key={c.idCliente} value={String(c.idCliente)}>
                      {c.nombresRazonSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )} />
          <FormField control={form.control} name="idDestinatario" render={({ field }) => (
            <FormItem>
              <FormLabel>Destinatario</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>
                  {data.destinatarios.map((d) => (
                    <SelectItem key={d.idDestinatario} value={String(d.idDestinatario)}>
                      {d.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idTerminalOrigen" render={({ field }) => (
            <FormItem>
              <FormLabel>Origen</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>{data.terminales.map((t) => <SelectItem key={t.idTerminal} value={t.idTerminal!.toString()}>{t.nombreUbicacion}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="idTerminalDestino" render={({ field }) => (
            <FormItem>
              <FormLabel>Destino (Opcional)</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>{data.terminales.map((t) => <SelectItem key={t.idTerminal} value={t.idTerminal!.toString()}>{t.nombreUbicacion}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="idCarga" render={({ field }) => (
          <FormItem>
            <FormLabel>Carga</FormLabel>
            <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
              <SelectContent>{data.cargas.map((ca) => <SelectItem key={ca.idCarga} value={ca.idCarga!.toString()}>{ca.tipoCarga} ({ca.codigoSeguimiento})</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idChofer" render={({ field }) => (
            <FormItem>
              <FormLabel>Chofer (Asignar)</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>{data.choferes.map((ch) => <SelectItem key={ch.idChofer} value={ch.idChofer!.toString()}>{ch.nombresCompletos}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="idCamion" render={({ field }) => (
            <FormItem>
              <FormLabel>Camión (Asignar)</FormLabel>
              <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una opción" /></SelectTrigger></FormControl>
                <SelectContent>{data.camiones.map((cm) => <SelectItem key={cm.idCamion} value={cm.idCamion!.toString()}>{cm.placa}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="observacion" render={({ field }) => (
          <FormItem>
            <FormLabel>Observación</FormLabel>
            <FormControl><Input {...field} /></FormControl>
          </FormItem>
        )} />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Programar Cita</Button>
        </div>
      </form>
    </Form>
  );
}