"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, CircleUserRound, LogOut, Map, Package, Truck, UserCheck, Users, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const quickLinks = [
  { label: "Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Camiones", href: "/dashboard/camiones", icon: Truck },
  { label: "Choferes", href: "/dashboard/choferes", icon: UserCheck },
  { label: "Terminales", href: "/dashboard/terminales", icon: Map },
  { label: "Cargas", href: "/dashboard/cargas", icon: Package },
  { label: "Citas", href: "/dashboard/citas", icon: Calendar },
];

export function UserDropdown() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  const isChofer = (role || "").toUpperCase().includes("CHOFER");
  const isOperador = (role || "").toUpperCase().includes("OPERADOR");

  const visibleLinks = quickLinks.filter((link) => {
    if (isChofer) {
      return ["/dashboard/citas", "/dashboard/cargas"].includes(link.href);
    } else if (isOperador) {
      return ["/dashboard/clientes", "/dashboard/camiones", "/dashboard/choferes", "/dashboard/terminales", "/dashboard/cargas", "/dashboard/citas"].includes(link.href);
    }
    return true; // Para otros roles, mostrar todos los enlaces
  });


  const displayName = user?.usuario || "Usuario";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg border border-sidebar-border  bg-sidebar-accent/20 px-3 py-2 text-left hover:bg-sidebar-accent/60 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <span className="flex items-center gap-2 overflow-hidden">
          <CircleUserRound className="h-4 w-4 shrink-0 text-sidebar-foreground/75" />
          <span className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/75" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className=" w-64 border-border/70 bg-white">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2">
                <span className="text-sm font-semibold text-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">{role || "Sin rol"}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {visibleLinks.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                <Icon className="h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className={"transition-colors hover:bg-destructive hover:text-destructive-foreground"} variant="default" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
