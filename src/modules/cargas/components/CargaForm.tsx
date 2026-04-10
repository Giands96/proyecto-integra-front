"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carga } from "../types";
import { cargaSchema } from "../schemas";
import { clienteService } from "@/modules/clientes/services/clienteService";
import type { z } from "zod";
import { Cliente } from "@/modules/clientes/types";

interface CargaFormProps {
  initialData?: Carga | null;
  onSubmit: (data: z.infer<typeof cargaSchema> & { idCarga?: number; estado?: string; cliente: { idCliente: number } }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CargaForm({ initialData, onSubmit, onCancel, loading }: CargaFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);

  // 1. Cargamos los clientes disponibles apenas se abre el formulario
  useEffect(() => {
    async function loadClientes() {
      try {
        const response = await clienteService.listarTodos();
        setClientes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setIsLoadingClientes(false);
      }
    }
    loadClientes();
  }, []);

  const form = useForm({
    resolver: zodResolver(cargaSchema),
    defaultValues: {
      tipoCarga: "",
      descripcionCarga: "",
      idCliente: 0,
    },
  });

  // 2. Si estamos editando, precargamos los datos (incluyendo el ID del cliente actual)
  useEffect(() => {
    if (initialData) {
      form.reset({
        tipoCarga: initialData.tipoCarga,
        descripcionCarga: initialData.descripcionCarga,
        idCliente: initialData.cliente?.idCliente ? Number(initialData.cliente.idCliente) : 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof cargaSchema>) => {
    const payload = {
      ...(initialData && { idCarga: initialData.idCarga }),
      tipoCarga: values.tipoCarga,
      descripcionCarga: values.descripcionCarga,
      idCliente: values.idCliente,
      cliente: { idCliente: values.idCliente }, 
      ...(initialData && { estado: initialData.estado }) 
    };
    
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        
        {/* Selector de Cliente */}
        <FormField
          control={form.control}
          name="idCliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente Dueño de la Carga</FormLabel>
              <Select
                disabled={isLoadingClientes}
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingClientes ? "Cargando clientes..." : "Seleccione un cliente"}>
                      {field.value
                        ? clientes.find((c) => c.idCliente === field.value)?.nombresRazonSocial
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((c) => (
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
        
        {/* Inputs de la Carga (Puestos en dos columnas para mejor diseño) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipoCarga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Carga</FormLabel>
                <FormControl><Input placeholder="Ej. Perecibles, Maquinaria..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descripcionCarga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl><Input placeholder="Detalles de la carga..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading || isLoadingClientes}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Actualizar" : "Guardar"} Carga
          </Button>
        </div>
      </form>
    </Form>
  );
}