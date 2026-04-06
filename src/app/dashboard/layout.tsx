"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token) {
      router.push("/login");
    }
  }, [token, router, hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
