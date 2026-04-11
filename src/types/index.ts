// Tipos globales compartidos entre features

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  ciclo?: Ciclo; // Puede no estar presente en respuestas de portal
}

export interface Ciclo {
  id: number;
  nombre: string;
  tipo: 'anual' | 'verano' | 'otro';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface Taller {
  id: number;
  nombre: string;
  tipo: 'instrumento' | 'taller';
}

export interface Matricula {
  id: number;
  ciclo?: Ciclo;
  ciclo_nombre?: string;
  taller: Taller;
  sesiones_contratadas: number;
  sesiones_disponibles: number;
  sesiones_consumidas: number;
  activo: boolean;
  concluida: boolean;
  precio_total: number;
  fecha_matricula: string;
}

export interface Asistencia {
  id: number;
  fecha: string;
  hora: string;
  estado: 'asistio' | 'falta' | 'falta_grave';
  taller_nombre: string;
  profesor_nombre: string;
}

export interface Horario {
  id: number;
  taller_nombre: string;
  tipo: 'instrumento' | 'taller';
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  profesor_nombre: string;
  salon: string;
}

export interface Pago {
  id: number;
  numero: string;
  monto_total: number;
  monto_pagado: number;
  saldo_pendiente: number;
  estado: 'pendiente' | 'pagado' | 'anulado';
  fecha_emision: string;
  metodo_pago?: string;
  porcentaje_descuento?: number;
  paquetes?: string[];
}

export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Alumno | null;
  isAuthenticated: boolean;
}
