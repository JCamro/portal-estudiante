import { useQuery } from '@tanstack/react-query';
import { horariosApi } from '../api/horariosApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useHorarios() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);

  return useQuery({
    queryKey: ['horarios', selectedCicloId],
    queryFn: () => horariosApi.getHorarios(selectedCicloId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
