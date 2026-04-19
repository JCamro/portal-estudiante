import { create } from 'zustand';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
  telefono?: string;
}

interface Ciclo {
  id: number;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface AuthState {
  // In-memory tokens (NOT localStorage)
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  ciclos: Ciclo[];
  cicloActivo: Ciclo | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  setCiclos: (ciclos: Ciclo[]) => void;
  setCicloActivo: (ciclo: Ciclo) => void;
  clearAuth: () => void;
  hasValidSession: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  ciclos: [],
  cicloActivo: null,
  isAuthenticated: false,

  setTokens: (access, refresh) =>
    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    }),

  setUser: (user) => set({ user }),

  setCiclos: (ciclos) => set({ ciclos }),

  setCicloActivo: (ciclo) => set({ cicloActivo: ciclo }),

  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      ciclos: [],
      cicloActivo: null,
      isAuthenticated: false,
    }),

  hasValidSession: () => {
    const state = get();
    return !!(
      state.isAuthenticated &&
      state.accessToken &&
      state.refreshToken &&
      state.user
    );
  },
}));
