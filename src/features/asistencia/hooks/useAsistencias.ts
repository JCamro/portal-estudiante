import { useQuery } from '@tanstack/react-query';
import { asistenciaApi } from '../api/asistenciaApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useAsistencias() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);

  return useQuery({
    queryKey: ['asistencias', selectedCicloId],
    queryFn: () => asistenciaApi.getAsistencias(selectedCicloId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
