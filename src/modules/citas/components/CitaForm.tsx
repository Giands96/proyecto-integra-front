"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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

const citaSchema = z.object({
  idCliente: z.coerce.number().min(1, "Cliente es requerido"),
  idDestinatario: z.coerce.number().min(1, "Destinatario es requerido"),
  idTerminalOrigen: z.coerce.number().min(1, "Origen es requerido"),
  idTerminalDestino: z.preprocess(
    (value) => (value === "" || value === 0 ? undefined : Number(value)),
    z.number().optional()
  ),
  idCarga: z.coerce.number().min(1, "Carga es requerida"),
  idChofer: z.preprocess(
    (value) => (value === "" || value === 0 ? undefined : Number(value)),
    z.number().optional()
  ),
  idCamion: z.preprocess(
    (value) => (value === "" || value === 0 ? undefined : Number(value)),
    z.number().optional()
  ),
  observacion: z.string().optional(),
});

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

  useEffect(() => {
    async function loadData() {
      const [cl, de, te, ca, ch, cm] = await Promise.all([
        clienteService.listar(),
        destinatarioService.listar(),
        terminalService.listar(),
        cargaService.listar(),
        choferService.listar(),
        camionService.listar()
      ]);
      setData({ clientes: cl, destinatarios: de, terminales: te, cargas: ca, choferes: ch, camiones: cm });
    }
    loadData();
  }, []);

  const form = useForm<CitaCompletaRequest>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      idCliente: 0, idDestinatario: 0, idTerminalOrigen: 0,
      idCarga: 0, observacion: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idCliente" render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                <SelectContent>{data.clientes.map((c) => <SelectItem key={c.idCliente} value={c.idCliente!.toString()}>{c.nombresRazonSocial}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="idDestinatario" render={({ field }) => (
            <FormItem>
              <FormLabel>Destinatario</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                <SelectContent>{data.destinatarios.map((d) => <SelectItem key={d.idDestinatario} value={d.idDestinatario!.toString()}>{d.nombreCompleto}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idTerminalOrigen" render={({ field }) => (
            <FormItem>
              <FormLabel>Origen</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                <SelectContent>{data.terminales.map((t) => <SelectItem key={t.idTerminal} value={t.idTerminal!.toString()}>{t.nombreUbicacion}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="idTerminalDestino" render={({ field }) => (
            <FormItem>
              <FormLabel>Destino (Opcional)</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                <SelectContent>{data.terminales.map((t) => <SelectItem key={t.idTerminal} value={t.idTerminal!.toString()}>{t.nombreUbicacion}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="idCarga" render={({ field }) => (
          <FormItem>
            <FormLabel>Carga</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
              <SelectContent>{data.cargas.map((ca) => <SelectItem key={ca.idCarga} value={ca.idCarga!.toString()}>{ca.tipoCarga} ({ca.codigoSeguimiento})</SelectItem>)}</SelectContent>
            </Select>
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="idChofer" render={({ field }) => (
            <FormItem>
              <FormLabel>Chofer (Asignar)</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Asignar luego" /></SelectTrigger></FormControl>
                <SelectContent>{data.choferes.map((ch) => <SelectItem key={ch.idChofer} value={ch.idChofer!.toString()}>{ch.nombresCompletos}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="idCamion" render={({ field }) => (
            <FormItem>
              <FormLabel>Camión (Asignar)</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Asignar luego" /></SelectTrigger></FormControl>
                <SelectContent>{data.camiones.map((cm) => <SelectItem key={cm.idCamion} value={cm.idCamion!.toString()}>{cm.placa}</SelectItem>)}</SelectContent>
              </Select>
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