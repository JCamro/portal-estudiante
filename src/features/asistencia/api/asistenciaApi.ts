import api from '@/api/axios';
import { PORTAL_ENDPOINTS } from '@/config/endpoints';
import type { Asistencia } from '@/types';

export interface AsistenciaApiResponse {
  id: number;
  fecha: string;
  hora: string;
  estado: 'asistio' | 'falta' | 'falta_grave';
  taller_nombre: string;
  profesor_nombre: string;
}

export interface AtencionItem {
  fecha: string;
  hora: string;
  estado: string;
}

export interface AsistenciaDetalleItem {
  taller_id: number;
  taller_nombre: string;
  tipo: 'instrumento' | 'taller';
  horario: {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
  };
  profesor_nombre: string;
  sesiones_contratadas: number;
  sesiones_disponibles: number;
  sesiones_consumidas: number;
  atenciones: AtencionItem[];
}

export interface AsistenciaDetalleResponse {
  por_taller: AsistenciaDetalleItem[];
}

export const asistenciaApi = {
  getAsistencias: async (
    cicloId?: number | null,
    limit = 20
  ): Promise<AsistenciaApiResponse[]> => {
    const params = new URLSearchParams();
    params.append('limit', String(limit));
    if (cicloId) {
      params.append('ciclo_id', String(cicloId));
    }
    const queryString = params.toString();
    const url = `${PORTAL_ENDPOINTS.asistencia()}${queryString ? `?${queryString}` : ''}`;
    const { data } = await api.get<AsistenciaApiResponse[]>(url);
    return data;
  },

  getAsistenciasTyped: async (cicloId?: number | null): Promise<Asistencia[]> => {
    const response = await asistenciaApi.getAsistencias(cicloId);
    return response as unknown as Asistencia[];
  },

  getAsistenciasDetalle: async (
    cicloId?: number | null
  ): Promise<AsistenciaDetalleResponse> => {
    const params = new URLSearchParams();
    if (cicloId) {
      params.append('ciclo_id', String(cicloId));
    }
    const queryString = params.toString();
    const url = `${PORTAL_ENDPOINTS.asistenciaDetalle()}${queryString ? `?${queryString}` : ''}`;
    const { data } = await api.get<AsistenciaDetalleResponse>(url);
    return data;
  },
};
