"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Chofer } from "../types";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { empleadoService } from "@/modules/empleados/services/empleadoService";
import { Empleado } from "@/modules/empleados/types";
import { Loader2 } from "lucide-react";
import { choferSchema } from "../schemas";

type ChoferFormInput = z.input<typeof choferSchema>;
type ChoferFormOutput = z.output<typeof choferSchema>;

interface ChoferFormProps {
  initialData?: Chofer | null;
  onSubmit: (data: Chofer) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ChoferForm({ initialData, onSubmit, onCancel, loading }: ChoferFormProps) {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoadingCatalogos, setIsLoadingCatalogos] = useState(true);

  const form = useForm<ChoferFormInput, unknown, ChoferFormOutput>({
    resolver: zodResolver(choferSchema),
    defaultValues: {
      idUsuario: 0,
      licencia: "",
      disponibilidad: 1,
    },
  });

  useEffect(() => {
    async function loadEmpleados() {
      try {
        const response = await empleadoService.listar();
        setEmpleados(Array.isArray(response.content) ? response.content : []);
      } catch (error) {
        console.error("Error loading empleados:", error);
        setEmpleados([]);
      } finally {
        setIsLoadingCatalogos(false);
      }
    }

    loadEmpleados();
  }, []);

  useEffect(() => {
    if (initialData) {
      form.reset({
        idUsuario: initialData.usuario?.idUsuario ?? 0,
        licencia: initialData.licencia,
        disponibilidad: initialData.disponibilidad,
      });
    }
  }, [initialData, form]);

  function handleSubmit(values: ChoferFormOutput) {
    const empleadoSeleccionado = empleados.find((item) => item.idUsuario === values.idUsuario);
    const nombreChofer = (empleadoSeleccionado ? `${empleadoSeleccionado.nombres} ${empleadoSeleccionado.apellidos}`.trim() : "") || empleadoSeleccionado?.username || initialData?.nombresCompletos || "";

    onSubmit({
      idChofer: initialData?.idChofer,
      nombresCompletos: nombreChofer,
      licencia: values.licencia,
      disponibilidad: values.disponibilidad,
      usuario: {
        idUsuario: values.idUsuario,
        username: empleadoSeleccionado?.username,
      },
    });
  }

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idUsuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empleado</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  onOpenChange={(open) => {
                    if (!open) {
                      field.onBlur();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.map((empleado) => (
                      <SelectItem key={empleado.idUsuario} value={String(empleado.idUsuario)}>
                        {`${empleado.nombres} ${empleado.apellidos}`.trim() || empleado.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value ?? 1)}
              >
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