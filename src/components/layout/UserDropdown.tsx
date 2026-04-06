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

  const displayName = user?.usuario || "Usuario";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full  items-center justify-between rounded-lg border px-3 py-2 text-left hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex items-center gap-2 overflow-hidden">
          <CircleUserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{displayName}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className="w-64 bg-white">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 rounded-full bg-muted px-2 py-2 border-black border">
                <span className="text-sm font-semibold text-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">{role || "Sin rol"}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {quickLinks.map((item) => {
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

        <DropdownMenuItem className={"hover:bg-red-700 transition-colors hover:text-white"} variant="default" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
