"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Chofer, ChoferUpdatePayload } from "../types";
import { useEffect } from "react";
import { choferSchema } from "../schemas";

type ChoferFormInput = z.input<typeof choferSchema>;
type ChoferFormOutput = z.output<typeof choferSchema>;

interface ChoferFormProps {
  initialData?: Chofer | null;
  onSubmit: (data: ChoferUpdatePayload) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ChoferForm({ initialData, onSubmit, onCancel, loading }: ChoferFormProps) {
  const form = useForm<ChoferFormInput, unknown, ChoferFormOutput>({
    resolver: zodResolver(choferSchema),
    defaultValues: {
      username: "",
      nombres: "",
      apellidos: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username,
        nombres: initialData.nombres,
        apellidos: initialData.apellidos,
        password: "",
      });
    }
  }, [initialData, form]);

  function handleSubmit(values: ChoferFormOutput) {
    onSubmit({
      username: values.username,
      nombres: values.nombres,
      apellidos: values.apellidos,
      rol: "CHOFER",
      password: values.password?.trim() ? values.password : undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input readOnly placeholder="chofer01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Perez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            Actualizar Chofer
          </Button>
        </div>
      </form>
    </Form>
  );
}