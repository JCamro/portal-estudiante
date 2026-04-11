import api from '@/api/axios';
import { PORTAL_ENDPOINTS } from '@/config/endpoints';
import type { DashboardData } from '../types';

export const dashboardApi = {
  getDashboardData: async (cicloId?: number | null): Promise<DashboardData> => {
    const url = cicloId
      ? `${PORTAL_ENDPOINTS.dashboard()}?ciclo_id=${cicloId}`
      : PORTAL_ENDPOINTS.dashboard();
    const { data } = await api.get(url);
    return data;
  },
};
