import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useDashboard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);

  return useQuery({
    queryKey: ['dashboard', selectedCicloId],
    queryFn: () => dashboardApi.getDashboardData(selectedCicloId),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
