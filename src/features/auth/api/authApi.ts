import axios from '@/api/axios';
import type { LoginRequest, LoginResponse } from '../types';
import { PORTAL_AUTH_ENDPOINTS } from '@/config/endpoints';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(PORTAL_AUTH_ENDPOINTS.login, data, {
      timeout: 10000,
    });
    return response.data;
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await axios.post(
      PORTAL_AUTH_ENDPOINTS.refresh,
      { refresh }
    );
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await axios.post(
      PORTAL_AUTH_ENDPOINTS.logout,
      { refresh: refreshToken }
    );
    return response.data;
  },
};
