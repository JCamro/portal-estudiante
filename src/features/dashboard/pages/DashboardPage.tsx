import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useDashboard } from '../hooks/useDashboard';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { GreetingCard } from '../components/GreetingCard';
import { MatriculasActivasCard } from '../components/MatriculasActivasCard';
import { PagosPendientesAlert } from '../components/PagosPendientesAlert';
import { HorariosProximosCard } from '../components/HorariosProximosCard';
import { UltimasAsistenciasCard } from '../components/UltimasAsistenciasCard';
import { CicloSelector } from '../components/CicloSelector';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const ciclos = useAuthStore((state) => state.ciclos);
  const { data, isLoading, error, refetch } = useDashboard();

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login', { replace: true });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-crema">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-righteous">Portal del Estudiante</h1>
            <Button variant="gold" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Greeting skeleton */}
          <Skeleton className="h-24 rounded-xl dark:bg-gray-700" />

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl dark:bg-gray-700" />
            <Skeleton className="h-64 rounded-xl dark:bg-gray-700" />
          </div>

          <Skeleton className="h-48 rounded-xl dark:bg-gray-700" />
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-crema">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-righteous">Portal del Estudiante</h1>
            <Button variant="gold" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="Error al cargar el dashboard">
            <p>No se pudieron cargar los datos. Por favor intentá de nuevo.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
              Reintentar
            </Button>
          </Alert>
        </main>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="min-h-screen bg-crema">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-righteous">Portal del Estudiante</h1>
            <Button variant="gold" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="warning" title="Sin datos">
            <p>No hay información disponible para mostrar.</p>
          </Alert>
        </main>
      </div>
    );
  }

  const selectedCiclo = ciclos?.find((c) => c.id === useAuthStore.getState().selectedCicloId);

  return (
    <div className="min-h-screen bg-crema">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
<h1 className="text-xl font-bold text-gray-900 dark:text-white font-righteous">Portal del Estudiante</h1>
            <div className="flex items-center gap-4">
              <CicloSelector />
              <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.nombre} {user?.apellido}
            </span>
            <Button variant="gold" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Row 1: Greeting - full width */}
          <GreetingCard nombre={user?.nombre} cicloActivo={selectedCiclo?.nombre} />

          {/* Row 2: Pagos pendientes - full width if any */}
          <PagosPendientesAlert pagos={data.pagos_pendientes} />

          {/* Row 3: Matrículas + Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MatriculasActivasCard matriculas={data.matriculas_activas} />
            <HorariosProximosCard horarios={data.horarios_proximos} />
          </div>

          {/* Row 4: Últimas Asistencias */}
          <UltimasAsistenciasCard assistencias={data.ultimas_asistencias} />
        </div>
      </main>
    </div>
  );
}
