import { useQuery } from '@tanstack/react-query';
import { pagosApi } from '../api/pagosApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function usePagos() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);

  return useQuery({
    queryKey: ['pagos', selectedCicloId],
    queryFn: () => pagosApi.getPagos(selectedCicloId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
