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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
          flex w-full items-center justify-between rounded-2xl
          border border-white/10 bg-white/10 px-3 py-3 text-left
          shadow-sm backdrop-blur-md transition-all duration-200
          hover:bg-white/15 hover:shadow-md
          outline-none focus-visible:ring-2 focus-visible:ring-white/30
        "
      >
        <span className="flex items-center gap-3 overflow-hidden">
          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
              bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md
            "
          >
            <CircleUserRound className="h-4 w-4" />
          </span>

          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-white">
              {displayName}
            </span>
            <span className="truncate text-xs text-slate-300">
              {role || "Sin rol"}
            </span>
          </span>
        </span>

        <ChevronDown className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        className="
          w-72 rounded-2xl border border-slate-200/70 bg-white p-2
          shadow-2xl
        "
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2">
            <div
              className="
                flex items-center gap-3 rounded-2xl
                bg-gradient-to-r from-slate-50 to-slate-100
                px-3 py-3
              "
            >
              <div
                className="
                  flex h-11 w-11 items-center justify-center rounded-xl
                  bg-gradient-to-br from-blue-500 to-cyan-400
                  text-white shadow-sm
                "
              >
                <CircleUserRound className="h-5 w-5" />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-slate-900">
                  {displayName}
                </span>
                <span className="truncate text-xs text-slate-500">
                  {role || "Sin rol"}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-slate-200" />

        <DropdownMenuGroup>
          {visibleLinks.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => router.push(item.href)}
                className="
                  flex cursor-pointer items-center gap-3 rounded-xl
                  px-3 py-2.5 text-sm font-medium text-slate-700
                  transition-all duration-200
                  hover:bg-slate-100 hover:text-slate-900
                  focus:bg-slate-100 focus:text-slate-900
                "
              >
                <span
                  className="
                    flex h-8 w-8 items-center justify-center rounded-lg
                    bg-slate-100 text-slate-600
                  "
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-slate-200" />

        <DropdownMenuItem
          className="
            flex cursor-pointer items-center gap-3 rounded-xl
            px-3 py-2.5 text-sm font-medium text-red-600
            transition-colors hover:bg-red-50 hover:text-red-700
            focus:bg-red-50 focus:text-red-700
          "
          variant="default"
          onClick={handleLogout}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
            <LogOut className="h-4 w-4" />
          </span>
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}