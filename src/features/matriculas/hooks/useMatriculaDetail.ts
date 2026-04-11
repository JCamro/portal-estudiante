import { useQuery } from '@tanstack/react-query';
import { matriculasApi } from '../api/matriculasApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useMatriculaDetail(id: number | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['matricula', id],
    queryFn: () => matriculasApi.getMatriculaById(id!),
    enabled: isAuthenticated && id !== null,
    staleTime: 5 * 60 * 1000,
  });
}
