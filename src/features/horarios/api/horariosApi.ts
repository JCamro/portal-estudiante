import api from '@/api/axios';
import { PORTAL_ENDPOINTS } from '@/config/endpoints';
import type { Horario } from '@/types';

export const horariosApi = {
  getHorarios: async (cicloId?: number | null): Promise<Horario[]> => {
    const url = cicloId
      ? `${PORTAL_ENDPOINTS.horarios()}?ciclo_id=${cicloId}`
      : PORTAL_ENDPOINTS.horarios();
    const { data } = await api.get<Horario[]>(url);
    return data;
  },
};
