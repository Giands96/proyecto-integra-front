"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Carga } from "../types";
import { useEffect } from "react";

const cargaSchema = z.object({
  tipoCarga: z.string().min(1, "Tipo de carga es requerido"),
  descripcionCarga: z.string().min(1, "Descripción es requerida"),
});

interface CargaFormProps {
  initialData?: Carga | null;
  onSubmit: (data: Carga) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CargaForm({ initialData, onSubmit, onCancel, loading }: CargaFormProps) {
  const form = useForm<z.infer<typeof cargaSchema>>({
    resolver: zodResolver(cargaSchema),
    defaultValues: {
      tipoCarga: "",
      descripcionCarga: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        tipoCarga: initialData.tipoCarga,
        descripcionCarga: initialData.descripcionCarga,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipoCarga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Carga</FormLabel>
              <FormControl><Input placeholder="Perecibles, Frágil, Maquinaria, etc." {...field} /></FormControl>
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
              <FormControl><Input placeholder="Detalles adicionales de la carga" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {initialData ? "Actualizar" : "Guardar"} Carga
          </Button>
        </div>
      </form>
    </Form>
  );
}