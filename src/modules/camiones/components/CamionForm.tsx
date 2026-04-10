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

const DEFAULT_FORM_VALUES: CamionFormValues = {
  placa: "",
  disponible: true,
};

export function CamionForm({ initialData, onSubmit, onCancel, loading }: CamionFormProps) {
  const form = useForm<CamionFormValues>({
    resolver: zodResolver(camionSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        placa: initialData.placa,
        disponible: Number(initialData.disponible) === 1,
      });
      return;
    }

    form.reset(DEFAULT_FORM_VALUES);
  }, [initialData, form]);

  const handleFormSubmit: SubmitHandler<CamionFormValues> = (data) => {
    onSubmit({
      placa: data.placa,
      disponible: data.disponible ? 1 : 0,
    });
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
          id="disponible"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("disponible", {
            setValueAs: (value) => value === true || value === "true",
          })}
        >
          <option value="true">Disponible</option>
          <option value="false">No Disponible</option>
        </select>
        {form.formState.errors.disponible && (
          <p className="text-sm text-red-500">{form.formState.errors.disponible.message}</p>
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
