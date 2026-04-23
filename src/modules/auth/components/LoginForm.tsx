"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, LockKeyhole, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { authService } from "../services/authService";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

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
    <section className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid-cols-2">
        <div className="hidden border-r border-zinc-200 bg-zinc-50 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
              Portal Administrativo
            </div>

            <div className="mt-8 space-y-4 mb-4">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
                Ransa Logística
              </h1>
              <p className="max-w-md text-sm leading-6 text-zinc-600">
                Gestiona operaciones, cargas, citas, terminales y usuarios desde
                una interfaz clara, moderna y eficiente.
              </p>
            </div>

            <Link href="/" className="text-sm px-4 py-2 bg-black rounded-full text-white  hover:underline">
              Deseas volver?
            </Link>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="text-sm font-medium text-zinc-900">
                Acceso seguro al sistema
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Ingresa con tus credenciales para continuar al panel principal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-2 px-0">
              <div className="flex justify-center lg:hidden">
                <div className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  Portal Administrativo
                </div>
              </div>

              <CardTitle className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
                Iniciar sesión
              </CardTitle>

              <p className="text-center text-sm text-zinc-500">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </CardHeader>

            <CardContent className="px-0 pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Usuario
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      placeholder="Ingresa tu usuario"
                      className="h-11 rounded-xl border-zinc-200 bg-white pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                      {...form.register("usuario")}
                    />
                  </div>
                  {form.formState.errors.usuario && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.usuario.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      className="h-11 rounded-xl border-zinc-200 bg-white pl-10 shadow-none focus-visible:ring-1 focus-visible:ring-zinc-300"
                      {...form.register("clave")}
                    />
                  </div>
                  {form.formState.errors.clave && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.clave.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar sesión
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center px-0 pt-6 text-sm text-zinc-500">
              Acceso exclusivo para personal autorizado
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}