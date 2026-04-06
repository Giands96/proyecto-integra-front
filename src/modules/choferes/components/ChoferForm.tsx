"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Chofer } from "../types";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const choferSchema = z.object({
  nombresCompletos: z.string().min(1, "Nombres completos son requeridos"),
  licencia: z.string().min(1, "Licencia es requerida"),
  disponibilidad: z.coerce.number().min(0).max(1),
  usuario: z.object({
    idUsuario: z.number().optional(),
    username: z.string().optional()
  }).optional()
});

interface ChoferFormProps {
  initialData?: Chofer | null;
  onSubmit: (data: Chofer) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ChoferForm({ initialData, onSubmit, onCancel, loading }: ChoferFormProps) {
  const form = useForm<z.infer<typeof choferSchema>>({
    resolver: zodResolver(choferSchema),
    defaultValues: {
      nombresCompletos: "",
      licencia: "",
      disponibilidad: 1,
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
        <FormField
          control={form.control}
          name="nombresCompletos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres Completos</FormLabel>
              <FormControl><Input placeholder="Juan Perez" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Licencia de Conducir</FormLabel>
              <FormControl><Input placeholder="Q12345678" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disponibilidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Disponible</SelectItem>
                  <SelectItem value="0">No Disponible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {initialData ? "Actualizar" : "Guardar" } Chofer
          </Button>
        </div>
      </form>
    </Form>
  );
}