import api from '@/api/axios';
import { PORTAL_ENDPOINTS } from '@/config/endpoints';
import type { Matricula } from '@/types';

export interface MatriculasResponse {
  activas: Matricula[];
  concluidas: Matricula[];
}

export const matriculasApi = {
  getMatriculas: async (cicloId?: number | null): Promise<MatriculasResponse> => {
    const url = cicloId
      ? `${PORTAL_ENDPOINTS.matriculas()}?ciclo_id=${cicloId}`
      : PORTAL_ENDPOINTS.matriculas();
    const { data } = await api.get<MatriculasResponse>(url);
    return data;
  },

  getMatriculaById: async (
    matriculaId: number,
    cicloId?: number | null
  ): Promise<Matricula | null> => {
    const url = cicloId
      ? `${PORTAL_ENDPOINTS.matriculas()}?ciclo_id=${cicloId}`
      : PORTAL_ENDPOINTS.matriculas();
    const { data } = await api.get<MatriculasResponse>(url);
    const all = [...data.activas, ...data.concluidas];
    return all.find((m) => m.id === matriculaId) || null;
  },

  getAll: async (cicloId?: number | null): Promise<Matricula[]> => {
    const data = await matriculasApi.getMatriculas(cicloId);
    return [...data.activas, ...data.concluidas];
  },
};
