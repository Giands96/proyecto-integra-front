"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { useAuthStore } from "@/store/authStore";
import {
  Users,
  Truck,
  MapPin,
  Package,
  Calendar,
  LayoutDashboard,
  UserCheck,
  UserCog,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/empleados", label: "Empleados", icon: UserCog },
  { href: "/dashboard/camiones", label: "Camiones", icon: Truck },
  { href: "/dashboard/choferes", label: "Choferes", icon: UserCheck },
  { href: "/dashboard/terminales", label: "Terminales", icon: MapPin },
  { href: "/dashboard/destinatarios", label: "Destinatarios", icon: MapPin },
  { href: "/dashboard/cargas", label: "Cargas", icon: Package },
  { href: "/dashboard/citas", label: "Citas", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((state) => state.role);

  const isOperador = (role || "").toUpperCase().includes("OPERADOR");
  const isChofer = (role || "").toUpperCase().includes("CHOFER");

  const visibleNavItems = isOperador
    ? navItems.filter((item) =>
        [
          "/dashboard/clientes",
          "/dashboard/camiones",
          "/dashboard/choferes",
          "/dashboard/terminales",
          "/dashboard/cargas",
          "/dashboard/citas",
        ].includes(item.href)
      )
    : isChofer
      ? navItems.filter((item) =>
          ["/dashboard/citas", "/dashboard/cargas"].includes(item.href)
        )
      : navItems;

  useEffect(() => {
    visibleNavItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router, visibleNavItems]);

  return (
    <aside
      className="
        flex h-screen w-72 flex-col
        border-r border-slate-200/70
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        text-white shadow-2xl
      "
    >
      <div className="border-b border-white/10 px-4 py-5">
        <div
          className="
            rounded-2xl border border-white/10
            bg-white/5 p-4 backdrop-blur-md
          "
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 items-center justify-center rounded-2xl
                bg-gradient-to-br from-blue-500 to-cyan-400
                text-base font-bold text-white shadow-lg
              "
            >
              R
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-white">
                Ransa Admin
              </h1>
              <p className="text-xs text-slate-400">
                Panel de administración
              </p>
            </div>
          </div>

          <UserDropdown />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-4 ">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Navegación
          </p>
        </div>

        <nav className="space-y-2 ">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                  group flex items-center justify-between rounded-2xl
                  px-3 py-3 transition-all duration-200 
                `,
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      `
                      flex h-10 w-10 items-center justify-center rounded-xl
                      transition-all duration-200
                    `,
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive
                      ? "translate-x-0 text-white/90"
                      : "translate-x-[-4px] opacity-0 text-slate-400 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="rounded-2xl bg-white/5 px-4 py-3 text-xs text-slate-400">
          Gestión logística y operaciones
        </div>
      </div>
    </aside>
  );
}