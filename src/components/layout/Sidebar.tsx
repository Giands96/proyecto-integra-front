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
  UserCog
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
        [
          "/dashboard/citas",
          "/dashboard/cargas",
        ].includes(item.href)
      )
    : navItems;

    

  useEffect(() => {
    visibleNavItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router, visibleNavItems]);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="space-y-3 border-b border-sidebar-border/80 bg-sidebar-accent/30 px-4 py-4">
        <div className="flex h-8 items-center px-2">
          <span className="text-xl font-bold tracking-tight">Ransa Admin</span>
        </div>
        <UserDropdown />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}