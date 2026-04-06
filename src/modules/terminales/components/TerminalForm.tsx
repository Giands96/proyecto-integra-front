"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Terminal } from "../types";
import { useEffect } from "react";
import { terminalSchema } from "../schemas";

interface TerminalFormProps {
  initialData?: Terminal | null;
  onSubmit: (data: Terminal) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TerminalForm({ initialData, onSubmit, onCancel, loading }: TerminalFormProps) {
  const form = useForm<z.infer<typeof terminalSchema>>({
    resolver: zodResolver(terminalSchema),
    defaultValues: {
      nombreUbicacion: "",
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
        <FormField
          control={form.control}
          name="nombreUbicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Ubicación (Sede)</FormLabel>
              <FormControl><Input placeholder="Terminal Callao" {...field} /></FormControl>
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
                <FormControl><Input placeholder="Callao" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {initialData ? "Actualizar" : "Guardar"} Terminal
          </Button>
        </div>
      </form>
    </Form>
  );
}