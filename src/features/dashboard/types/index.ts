// Dashboard types - matches backend /api/portal/me/dashboard/ response

import type { Pago } from '@/types';

// Tipos específicos del dashboard que vienen del backend
export interface DashboardAlumno {
  id: number;
  nombre: string;
  apellido: string;
}

export interface DashboardAsistenciaStats {
  total: number;
  asistidas: number;
  faltas: number;
  faltas_graves: number;
  porcentaje: number;
}

export interface DashboardData {
  alumno: DashboardAlumno;
  ciclo_activo: string;
  matriculas_activas: import('@/types').Matricula[];
  horarios_proximos: import('@/types').Horario[];
  ultimas_asistencias: import('@/types').Asistencia[];
  asistencia_stats: DashboardAsistenciaStats;
  pagos_pendientes: Pago[];
}
