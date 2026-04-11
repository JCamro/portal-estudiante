import { useHorarios } from '../hooks/useHorarios';
import { WeekSchedule } from '../components/WeekSchedule';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function HorariosPage() {
  const { data: horarios, isLoading, error } = useHorarios();

  return (
    <div>
      <SectionHeader title="Mis Horarios" description="Calendario de clases semanal" />

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-crema dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar los horarios</p>
        </div>
      )}

      {!isLoading && !error && horarios && <WeekSchedule horarios={horarios} />}

      {!isLoading && !error && horarios?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay horarios disponibles</p>
        </div>
      )}
    </div>
  );
}
