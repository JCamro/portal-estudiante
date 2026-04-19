import api from './axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    telefono?: string;
    email?: string;
  };
  ciclos: Ciclo[];
}

export interface Ciclo {
  id: number;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface AttendanceRecord {
  id: number;
  fecha: string;
  hora: string;
  estado: 'asistio' | 'falta' | 'falta_grave';
  taller_nombre: string;
  horario_dia: string;
  horario_hora: string;
  profesor_nombre: string;
}

export interface ScheduleRecord {
  id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  taller_nombre: string;
  profesor_nombre: string;
  salon?: string;
}

export interface PaymentRecord {
  id: number;
  numero: string;
  monto_total: string;
  monto_pagado: string;
  saldo_pendiente: string;
  estado: 'pendiente' | 'pagado' | 'anulado';
  fecha_emision: string;
  porcentaje_descuento: number;
  paquetes: string[]; // Nombres de talleres incluidos en el recibo
}

export interface TallerInfo {
  id: number;
  nombre: string;
  tipo: string;
}

export interface EnrollmentRecord {
  id: number;
  taller: TallerInfo;
  ciclo_nombre: string;
  sesiones_contratadas: number;
  sesiones_disponibles: number;
  sesiones_consumidas: number;
  concluida: boolean;
  precio_total: string;
  fecha_matricula: string;
}

export interface EnrollmentsResponse {
  activas: EnrollmentRecord[];
  concluidas: EnrollmentRecord[];
}

export interface DashboardStats {
  total_asistencias: number;
  total_ausencias: number;
  total_tardanzas: number;
  porcentaje_asistencia: string;
  proximo_horario?: ScheduleRecord;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const portalLogin = async (dni: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/portal/auth/login/', { dni });
  return response.data;
};

export const portalRefresh = async (refresh: string): Promise<{ access: string }> => {
  const response = await api.post<{ access: string }>('/portal/auth/refresh/', { refresh });
  return response.data;
};

export const portalLogout = async (refresh: string): Promise<void> => {
  await api.post('/portal/auth/logout/', { refresh });
};

export const portalMe = async (): Promise<LoginResponse['user']> => {
  const response = await api.get<LoginResponse['user']>('/portal/me/');
  return response.data;
};

export const getAttendance = async (cicloId: number): Promise<AttendanceRecord[]> => {
  const response = await api.get<AttendanceRecord[]>(
    `/portal/me/asistencias/?ciclo_id=${cicloId}`
  );
  return response.data;
};

export const getSchedules = async (cicloId: number): Promise<ScheduleRecord[]> => {
  const response = await api.get<ScheduleRecord[]>(
    `/portal/me/horarios/?ciclo_id=${cicloId}`
  );
  return response.data;
};

export const getPayments = async (cicloId: number): Promise<PaymentRecord[]> => {
  const response = await api.get<PaymentRecord[]>(
    `/portal/me/pagos/?ciclo_id=${cicloId}`
  );
  return response.data;
};

export const getEnrollments = async (cicloId: number): Promise<EnrollmentsResponse> => {
  const response = await api.get<EnrollmentsResponse>(
    `/portal/me/matriculas/?ciclo_id=${cicloId}`
  );
  return response.data;
};

export const getDashboardStats = async (cicloId: number): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>(
    `/portal/me/dashboard/?ciclo_id=${cicloId}`
  );
  return response.data;
};
