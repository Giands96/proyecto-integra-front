"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { 
  Users, 
  Truck, 
  MapPin, 
  Package, 
  Calendar, 
  LayoutDashboard,
  UserCheck
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/camiones", label: "Camiones", icon: Truck },
  { href: "/dashboard/choferes", label: "Choferes", icon: UserCheck },
  { href: "/dashboard/terminales", label: "Terminales", icon: MapPin },
  { href: "/dashboard/cargas", label: "Cargas", icon: Package },
  { href: "/dashboard/citas", label: "Citas", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-200 bg-white">
      <div className="space-y-3 border-b px-4 py-4">
        <div className="flex h-8 items-center px-2">
          <span className="text-xl font-bold text-zinc-900">Ransa Admin</span>
        </div>
        <UserDropdown />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}