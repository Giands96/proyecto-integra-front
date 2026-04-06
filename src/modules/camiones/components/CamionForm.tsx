"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camion } from "../types";
import { camionSchema } from "../schemas";

type CamionFormValues = z.infer<typeof camionSchema>;

interface CamionFormProps {
  initialData?: Camion | null;
  onSubmit: (data: Camion) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CamionForm({ initialData, onSubmit, onCancel, loading }: CamionFormProps) {
  const form = useForm<CamionFormValues>({
    resolver: zodResolver(camionSchema),
    defaultValues: {
      placa: "",
      disponibilidad: 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        placa: initialData.placa,
        disponibilidad: initialData.disponibilidad,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<CamionFormValues> = (data) => {
    onSubmit(data as Camion);
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="placa" className="text-sm font-medium">
          Placa
        </label>
        <Input id="placa" placeholder="ABC-123" {...form.register("placa")} />
        {form.formState.errors.placa && (
          <p className="text-sm text-red-500">{form.formState.errors.placa.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="disponibilidad" className="text-sm font-medium">
          Estado
        </label>
        <select
          id="disponibilidad"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("disponibilidad", { valueAsNumber: true })}
        >
          <option value={1}>Disponible</option>
          <option value={0}>No Disponible</option>
        </select>
        {form.formState.errors.disponibilidad && (
          <p className="text-sm text-red-500">{form.formState.errors.disponibilidad.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {initialData ? "Actualizar" : "Guardar"} Camión
        </Button>
      </div>
    </form>
  );
}
