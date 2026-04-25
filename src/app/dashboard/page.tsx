"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Truck,
  UserCheck,
  Users,
  Package,
  MapPin,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { camionService } from "@/modules/camiones/services/camionService";
import { choferService } from "@/modules/choferes/services/choferService";
import { clienteService } from "@/modules/clientes/services/clienteService";
import { terminalService } from "@/modules/terminales/services/terminalService";
import { cargaService } from "@/modules/cargas/services/cargaService";
import { citaService } from "@/modules/citas/services/citaService";

type DashboardData = {
  clientes: number;
  camiones: number;
  choferes: number;
  terminales: number;
  cargas: number;
  citas: number;
  camionesDisponibles: number;
  camionesNoDisponibles: number;
  choferesDisponibles: number;
  choferesNoDisponibles: number;
  citasPorEstado: Array<{ name: string; value: number }>;
};

const PIE_COLORS = ["#2150c5", "#2f6ecf", "#22a8b8", "#67b6b8", "#9bcad2"];

const quickAccess = [
  { label: "Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Camiones", href: "/dashboard/camiones", icon: Truck },
  { label: "Choferes", href: "/dashboard/choferes", icon: UserCheck },
  { label: "Terminales", href: "/dashboard/terminales", icon: MapPin },
  { label: "Cargas", href: "/dashboard/cargas", icon: Package },
  { label: "Citas", href: "/dashboard/citas", icon: Calendar },
];

function normalizeEstado(estado?: string) {
  return (estado || "Sin estado").trim().toLowerCase();
}

function toTitle(value: string) {
  if (!value) {
    return "Sin estado";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDisponibilidadSplit<T>(items: T[]) {
  const disponibles = items.filter((item) => {
    const disponibilidad = (item as { disponibilidad?: number }).disponibilidad ?? 0;
    return disponibilidad > 0;
  }).length;

  return {
    disponibles,
    noDisponibles: items.length - disponibles,
  };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    clientes: 0,
    camiones: 0,
    choferes: 0,
    terminales: 0,
    cargas: 0,
    citas: 0,
    camionesDisponibles: 0,
    camionesNoDisponibles: 0,
    choferesDisponibles: 0,
    choferesNoDisponibles: 0,
    citasPorEstado: [],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [clientes, camiones, choferes, terminales, cargas, citas] = await Promise.all([
          clienteService.listar(),
          camionService.listar(),
          choferService.listar(),
          terminalService.listar(),
          cargaService.listar(),
          citaService.listar(),
        ]);

        const splitCamiones = getDisponibilidadSplit(camiones.content);
        const splitChoferes = getDisponibilidadSplit(choferes.content);

        const citasByEstado = citas.content.reduce<Record<string, number>>((acc, item) => {
          const estado = normalizeEstado(item.estado);
          acc[estado] = (acc[estado] || 0) + 1;
          return acc;
        }, {});

        const citasPorEstado = Object.entries(citasByEstado).map(([estado, value]) => ({
          name: toTitle(estado),
          value,
        }));

        setData({
          clientes: clientes.content.length,
          camiones: camiones.content.length,
          choferes: choferes.content.length,
          terminales: terminales.content.length,
          cargas: cargas.content.length,
          citas: citas.content.length,
          camionesDisponibles: splitCamiones.disponibles,
          camionesNoDisponibles: splitCamiones.noDisponibles,
          choferesDisponibles: splitChoferes.disponibles,
          choferesNoDisponibles: splitChoferes.noDisponibles,
          citasPorEstado,
        });
      } catch {
        setError("No se pudieron cargar las metricas del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const disponibilidadCamiones = useMemo(
    () => [
      { name: "Disponibles", value: data.camionesDisponibles },
      { name: "No disponibles", value: data.camionesNoDisponibles },
    ],
    [data.camionesDisponibles, data.camionesNoDisponibles]
  );

  const disponibilidadChoferes = useMemo(
    () => [
      { name: "Disponibles", value: data.choferesDisponibles },
      { name: "No disponibles", value: data.choferesNoDisponibles },
    ],
    [data.choferesDisponibles, data.choferesNoDisponibles]
  );

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Principal</h1>
        <p className="text-muted-foreground">
          Vista consolidada de tu operacion logistica con indicadores y distribuciones clave.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/35 bg-destructive/5">
          <CardContent className="pt-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Clientes</CardDescription>
            <CardTitle className="text-3xl">{data.clientes}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Camiones</CardDescription>
            <CardTitle className="text-3xl">{data.camiones}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Choferes</CardDescription>
            <CardTitle className="text-3xl">{data.choferes}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Terminales</CardDescription>
            <CardTitle className="text-3xl">{data.terminales}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Cargas</CardDescription>
            <CardTitle className="text-3xl">{data.cargas}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardDescription>Total Citas</CardDescription>
            <CardTitle className="text-3xl">{data.citas}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Disponibilidad de Camiones</CardTitle>
            <CardDescription>Distribucion actual de la flota</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disponibilidadCamiones} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {disponibilidadCamiones.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "rgba(100, 116, 139, 0.25)",
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Disponibilidad de Choferes</CardTitle>
            <CardDescription>Estado operativo del personal</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disponibilidadChoferes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {disponibilidadChoferes.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "rgba(100, 116, 139, 0.25)",
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Estado de Citas</CardTitle>
            <CardDescription>Recuento por estado registrado</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.citasPorEstado.length ? data.citasPorEstado : [{ name: "Sin datos", value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {(data.citasPorEstado.length ? data.citasPorEstado : [{ name: "Sin datos", value: 1 }]).map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "rgba(100, 116, 139, 0.25)",
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quickAccess.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-card/90 px-4 py-3 text-sm shadow-sm transition hover:border-primary/35 hover:bg-secondary/55"
            >
              <span className="flex items-center gap-2 font-medium">
                <Icon className="h-4 w-4 text-primary" />
                {item.label}
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </section>
    </div>
  );
}
