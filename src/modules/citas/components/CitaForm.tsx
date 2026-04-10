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

// Importamos nuestro nuevo y flamante modal interactivo
import { CargaSelectorModal } from "../../cargas/components/CargaSelectorModal";

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
          clienteService.listarTodos(),
          destinatarioService.listar(),
          terminalService.listar(),
          cargaService.listar(),
          choferService.listar(),
          camionService.listar()
        ]);

        setData({
          clientes: Array.isArray(cl) ? cl : [],
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
      idCarga: 0, idUsuario: 0, idCamion: 0, observacion: ""
    } as CitaFormInput
  });

  // 👇 LÓGICA DE UX: Observamos qué cliente se ha seleccionado
  const idClienteSeleccionado = form.watch("idCliente") as number;
  
  // Filtramos las cargas disponibles para mostrar solo las de ese cliente
  // Además, ocultamos las cargas que ya han sido entregadas o canceladas
  const cargasDisponibles = data.cargas.filter((c) => {
    const esDelCliente = typeof idClienteSeleccionado === "number" && idClienteSeleccionado > 0 ? c.cliente?.idCliente === idClienteSeleccionado : true;
    const estaDisponible = c.estado !== "ENTREGADA" && c.estado !== "CANCELADA";
    return esDelCliente && estaDisponible;
  });

  // Si se cambia el cliente, reseteamos la carga seleccionada para evitar incongruencias
  useEffect(() => {
    const idCargaActual = form.getValues("idCarga") as number;
    if (idClienteSeleccionado && typeof idCargaActual === "number" && idCargaActual > 0) {
      form.setValue("idCarga", 0);
    }
  }, [idClienteSeleccionado, form]);

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
      <form
        onSubmit={form.handleSubmit((values) =>
          onSubmit({
            ...values,
            // Aseguramos enviar idUsuario correctamente (la corrección que hicimos antes)
            idUsuario: values.idUsuario && values.idUsuario > 0 ? values.idUsuario : undefined,
            idCamion: values.idCamion && values.idCamion > 0 ? values.idCamion : undefined,
          })
        )}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idCliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? data.clientes.find((c) => c.idCliente === field.value)?.nombresRazonSocial
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.clientes.map((c) => (
                      <SelectItem key={c.idCliente} value={String(c.idCliente)}>
                        {c.nombresRazonSocial}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idDestinatario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatario</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? data.destinatarios.find((d) => d.idDestinatario === field.value)?.nombreCompleto
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
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
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idTerminalOrigen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origen</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? data.terminales.find((t) => t.idTerminal === field.value)?.nombreUbicacion
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.terminales.map((t) => (
                      <SelectItem key={t.idTerminal} value={String(t.idTerminal)}>
                        {t.nombreUbicacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idTerminalDestino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino (Opcional)</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? data.terminales.find((t) => t.idTerminal === field.value)?.nombreUbicacion
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.terminales.map((t) => (
                      <SelectItem key={t.idTerminal} value={String(t.idTerminal)}>
                        {t.nombreUbicacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 👇 AQUÍ INTEGRAMOS EL MODAL 👇 */}
        <FormField
          control={form.control}
          name="idCarga"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Carga a Transportar</FormLabel>
              <FormControl>
                <CargaSelectorModal 
                  cargas={cargasDisponibles} 
                  selectedCargaId={typeof field.value === "number" ? field.value : undefined} 
                  onSelect={(id: number) => field.onChange(id)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="idUsuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chofer (Asignar)</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? (() => {
                              const ch = data.choferes.find((ch) => ch.idUsuario === field.value);
                              return ch ? `${ch.nombres} ${ch.apellidos}` : null;
                            })()
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.choferes.map((ch) => (
                      <SelectItem key={ch.idUsuario} value={String(ch.idUsuario)}>
                        {ch.nombres} {ch.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idCamion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camión (Asignar)</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción">
                        {field.value
                          ? data.camiones.find((cm) => cm.idCamion === field.value)?.placa
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data.camiones.map((cm) => (
                      <SelectItem key={cm.idCamion} value={String(cm.idCamion)}>
                        {cm.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diasEstimados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo Estimado</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Días..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                      <SelectItem key={dia} value={String(dia)}>
                        {dia} {dia === 1 ? "día" : "días"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="observacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observación</FormLabel>
              <FormControl>
                <Input placeholder="Notas adicionales sobre la ruta o la cita..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            Programar Cita
          </Button>
        </div>
      </form>
    </Form>
  );
}