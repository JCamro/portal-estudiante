import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthStore } from '../types';
import { authApi } from '../api/authApi';

// Intent throttle: 3 intentos, lock 30s
const MAX_ATTEMPTS = 3;
const LOCK_DURATION_MS = 30000;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      ciclos: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      attemptCount: 0,
      lastAttemptTime: null,
      isLocked: false,
      selectedCicloId: null,

      login: async (dni: string) => {
        const state = get();

        // Check if locked
        if (state.isLocked) {
          const now = Date.now();
          const lockTimeRemaining = state.lastAttemptTime
            ? LOCK_DURATION_MS - (now - state.lastAttemptTime)
            : 0;
          if (lockTimeRemaining > 0) {
            set({ error: `Demasiados intentos. Esperá ${Math.ceil(lockTimeRemaining / 1000)}s` });
            return;
          } else {
            // Unlock if time passed
            set({ isLocked: false, attemptCount: 0, lastAttemptTime: null });
          }
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login({ dni });

          set({
            accessToken: response.access,
            refreshToken: response.refresh,
            user: response.user,
            ciclos: response.ciclos,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            attemptCount: 0,
            lastAttemptTime: null,
            isLocked: false,
            // Auto-select first ciclo with active matricula or first ciclo
            selectedCicloId:
              response.ciclos.find((c) => c.has_matricula_activa)?.id ??
              response.ciclos[0]?.id ??
              null,
          });

          // Debug log para desarrollo (no exponer en producción)
          console.log('[Auth] Login exitoso', {
            userId: response.user.id,
            dni: response.user.dni,
          });
        } catch (error) {
          const attemptCount = state.attemptCount + 1;
          const lastAttemptTime = Date.now();
          const isLocked = attemptCount >= MAX_ATTEMPTS;

          // Loguear detalles del error para debugging (NO mostrar en UI)
          console.error('[Auth] Login fallido', {
            attemptCount,
            isLocked,
            status: (error as { response?: { status?: number } }).response?.status,
            message: (error as Error).message,
          });

          set({
            isLoading: false,
            // Mensaje genérico - no filtrar información
            error: 'DNI no encontrado. Verificá que el DNI sea correcto.',
            attemptCount,
            lastAttemptTime,
            isLocked,
          });

          if (isLocked) {
            setTimeout(() => {
              set({ isLocked: false, attemptCount: 0, lastAttemptTime: null });
            }, LOCK_DURATION_MS);
          } else if (attemptCount >= MAX_ATTEMPTS - 1) {
            // 2 failed attempts left warning
            set({
              error: `Último intento antes de bloquear por ${LOCK_DURATION_MS / 1000}s. Asegurate de usar un DNI válido.`,
            });
          }
        }
      },

      logout: () => {
        const state = get();
        console.log('[Auth] Logout', { userId: state.user?.id });
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          ciclos: null,
          isAuthenticated: false,
          error: null,
          attemptCount: 0,
          lastAttemptTime: null,
          isLocked: false,
          selectedCicloId: null,
        });
      },

      clearError: () => set({ error: null }),

      setSelectedCicloId: (cicloId: number | null) => {
        set({ selectedCicloId: cicloId });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return null;

        try {
          const response = await authApi.refreshToken(refreshToken);
          set({ accessToken: response.access });
          console.log('[Auth] Token refrescado');
          return response.access;
        } catch (error) {
          console.error('[Auth] Refresh fallido', error);
          // Refresh failed - logout
          get().logout();
          return null;
        }
      },
    }),
    { name: 'auth-store' }
  )
);
