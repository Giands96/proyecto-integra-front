import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearApiCache } from '@/lib/apiCache';

interface AuthState {
  token: string | null;
  role: string | null;
  hasHydrated: boolean;
  user: {
    usuario: string;
    email?: string;
  } | null;
  setAuth: (
    token: string,
    role: string,
    user: {
      usuario: string;
      email?: string;
    }
  ) => void;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      hasHydrated: false,
      user: null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setAuth: (token, role, user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', token);
        }
        set({ token, role, user });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        clearApiCache();
        set({ token: null, role: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
