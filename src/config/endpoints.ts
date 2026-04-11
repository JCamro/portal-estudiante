/**
 * Configuración de Endpoints del Portal Estudiante
 *
 * Usa VITE_API_URL para configuración rápida en deploy.
 * Solo cambiar la variable de entorno y todo funciona.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = `${API_BASE}/api`;

// ========================
// PORTAL AUTH (Student-facing)
// ========================
// Login: POST /api/portal/auth/login/ {dni: string}
// Refresh: POST /api/portal/auth/refresh/ {refresh: string}
// Logout: POST /api/portal/auth/logout/ {refresh: string}
export const PORTAL_AUTH_ENDPOINTS = {
  login: `${API_PREFIX}/portal/auth/login/`,
  refresh: `${API_PREFIX}/portal/auth/refresh/`,
  logout: `${API_PREFIX}/portal/auth/logout/`,
} as const;

// ========================
// PORTAL DATA (Student data — ID comes from JWT, NOT from URL)
// ========================
// All these endpoints extract alumno_id from the JWT token
// They do NOT take alumnoId as parameter
export const PORTAL_ENDPOINTS = {
  me: () => `${API_PREFIX}/portal/me/`,
  ciclos: () => `${API_PREFIX}/portal/me/ciclos/`,
  matriculas: () => `${API_PREFIX}/portal/me/matriculas/`,
  matriculasHistorial: () => `${API_PREFIX}/portal/me/matriculas/historial/`,
  asistencia: () => `${API_PREFIX}/portal/me/asistencias/`,
  asistenciaDetalle: () => `${API_PREFIX}/portal/me/asistencias/detalle/`,
  horarios: () => `${API_PREFIX}/portal/me/horarios/`,
  pagos: () => `${API_PREFIX}/portal/me/pagos/`,
  dashboard: () => `${API_PREFIX}/portal/me/dashboard/`,
} as const;

// ========================
// HELPERS
// ========================
export const getEndpoint = (path: string) => `${API_PREFIX}${path}`;
