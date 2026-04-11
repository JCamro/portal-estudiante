export interface LoginRequest {
  dni: string;
}

export interface CicloInfo {
  id: number;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  has_matricula_activa?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
  };
  ciclos: CicloInfo[];
}

export interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: LoginResponse['user'] | null;
  ciclos: CicloInfo[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  attemptCount: number;
  lastAttemptTime: number | null;
  isLocked: boolean;
  selectedCicloId: number | null;
  login: (dni: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshAccessToken: () => Promise<string | null>;
  setSelectedCicloId: (cicloId: number | null) => void;
}
