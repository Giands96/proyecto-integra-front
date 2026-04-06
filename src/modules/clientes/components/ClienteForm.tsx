"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Cliente } from "../types";
import { useEffect } from "react";

const clienteSchema = z.object({
  tipoDocumento: z.string().min(1, "Tipo de documento es requerido"),
  numeroDocumento: z.string().min(1, "Numero de documento es requerido"),
  nombresRazonSocial: z.string().min(1, "Nombre o Razon Social es requerido"),
  departamento: z.string().min(1, "Departamento es requerido"),
  provincia: z.string().min(1, "Provincia es requerida"),
  distrito: z.string().min(1, "Distrito es requerido"),
});

interface ClienteFormProps {
  initialData?: Cliente | null;
  onSubmit: (data: Cliente) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ClienteForm({ initialData, onSubmit, onCancel, loading }: ClienteFormProps) {
  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipoDocumento: "",
      numeroDocumento: "",
      nombresRazonSocial: "",
      departamento: "",
      provincia: "",
      distrito: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipoDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Documento</FormLabel>
                <FormControl><Input placeholder="DNI / RUC" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numeroDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero Documento</FormLabel>
                <FormControl><Input placeholder="12345678" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="nombresRazonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razon Social</FormLabel>
              <FormControl><Input placeholder="Nombre completo o Empresa" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl><Input placeholder="Lima" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provincia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl><Input placeholder="Lima" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <FormControl><Input placeholder="Miraflores" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button   type="submit" disabled={loading}>
            {initialData ? "Actualizar" : "Guardar"} Cliente
          </Button>
        </div>
      </form>
    </Form>
  );
}