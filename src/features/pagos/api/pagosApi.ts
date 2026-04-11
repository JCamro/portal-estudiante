import api from '@/api/axios';
import { PORTAL_ENDPOINTS } from '@/config/endpoints';
import type { Pago } from '@/types';

export const pagosApi = {
  getPagos: async (
    cicloId?: number | null,
    filtro?: 'pendientes' | 'pagados' | 'todos'
  ): Promise<Pago[]> => {
    const params = new URLSearchParams();
    if (cicloId) {
      params.append('ciclo_id', String(cicloId));
    }
    if (filtro && filtro !== 'todos') {
      params.append('filtro', filtro);
    }
    const queryString = params.toString();
    const url = `${PORTAL_ENDPOINTS.pagos()}${queryString ? `?${queryString}` : ''}`;
    const { data } = await api.get<Pago[]>(url);
    return data;
  },
};
