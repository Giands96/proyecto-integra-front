"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (token) {
      router.replace("/dashboard");
    }
  }, [token, hasHydrated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (token) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-100">
      <LoginForm />
    </div>
  );
}
