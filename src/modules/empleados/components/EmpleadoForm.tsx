"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrearEmpleadoPayload, ActualizarEmpleadoPayload, Empleado } from "../types";
import { empleadoSchema, actualizarEmpleadoSchema } from "../schemas";

interface EmpleadoFormProps {
  onSubmit: (data: CrearEmpleadoPayload | ActualizarEmpleadoPayload) => void;
  onCancel: () => void;
  loading?: boolean;
  editingEmpleado?: Empleado;
}

export function EmpleadoForm({ onSubmit, onCancel, loading, editingEmpleado }: EmpleadoFormProps) {
  const isEditing = !!editingEmpleado;
  const schema = isEditing ? actualizarEmpleadoSchema : empleadoSchema;
  
  const form = useForm<CrearEmpleadoPayload | ActualizarEmpleadoPayload>({
    resolver: zodResolver(schema as any),
    defaultValues: isEditing ? {
      nombres: editingEmpleado.nombres,
      apellidos: editingEmpleado.apellidos,
      rol: (editingEmpleado.role as any),
    } : {
      nombres: "",
      apellidos: "",
      username: "",
      password: "",
      rol: "OPERADOR",
    },
  });

  useEffect(() => {
    if (isEditing && editingEmpleado) {
      form.reset({
        nombres: editingEmpleado.nombres,
        apellidos: editingEmpleado.apellidos,
        rol: (editingEmpleado.role as any),
      });
    }
  }, [editingEmpleado, isEditing, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        {!isEditing && (
          <>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="juan.perez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrasena</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRADOR">ADMINISTRADOR</SelectItem>
                    <SelectItem value="OPERADOR">OPERADOR</SelectItem>
                    <SelectItem value="CHOFER">CHOFER</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{isEditing ? "Actualizar Empleado" : "Guardar Empleado"}</Button>
        </div>
      </form>
    </Form>
  );
}
