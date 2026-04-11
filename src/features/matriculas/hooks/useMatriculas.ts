import { useQuery } from '@tanstack/react-query';
import { matriculasApi } from '../api/matriculasApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useMatriculas() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);

  return useQuery({
    queryKey: ['matriculas', selectedCicloId],
    queryFn: () => matriculasApi.getMatriculas(selectedCicloId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
