import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: adjunta JWT del store en memoria (NO localStorage)
api.interceptors.request.use(
  (config) => {
    // Zustand: getState() da el estado actual sin hook
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: maneja 401 con logout del store
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - logout y redirect
      useAuthStore.getState().logout();
      // Solo redirigir si no estamos ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper para usar en casos especiales (ej: refresh token)
export const getAuthToken = () => useAuthStore.getState().accessToken;
export const setAuthTokens = (access: string, refresh?: string) => {
  useAuthStore.setState({ accessToken: access });
  if (refresh) useAuthStore.setState({ refreshToken: refresh });
};
export const clearAuthTokens = () => {
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  });
};

export default api;
