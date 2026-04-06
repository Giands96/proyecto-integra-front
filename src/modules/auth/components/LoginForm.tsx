"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { authService } from "../services/authService";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  usuario: z.string().min(1, "Usuario es requerido"),
  clave: z.string().min(1, "Contraseña es requerida"),
});

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      clave: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(values);
      const usuario =
        response.usuario ||
        response.user?.usuario ||
        response.user?.username ||
        response.user?.nombreCompleto ||
        values.usuario;

      setAuth(response.token, response.role, {
        usuario,
        email: response.user?.email,
      });
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas o error de servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen w-full bg-zinc-100 flex items-center justify-center p-4">
    
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Ransa Logística</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Usuario</label>
            <Input placeholder="admin" {...form.register("usuario")} />
            {form.formState.errors.usuario && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.usuario.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Contraseña</label>
            <Input type="password" placeholder="********" {...form.register("clave")} />
            {form.formState.errors.clave && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.clave.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Portal Administrativo
      </CardFooter>
    </Card>
    </section>
  );
}