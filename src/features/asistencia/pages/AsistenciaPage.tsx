import { useAsistencias } from '../hooks/useAsistencias';
import { AttendanceStats } from '../components/AttendanceStats';
import { AsistenciaList } from '../components/AsistenciaList';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function AsistenciaPage() {
  const { data: asistENCIAS, isLoading, error } = useAsistencias();

  return (
    <div>
      <SectionHeader title="Mi Asistencia" description="Registro de asistencia a clases" />

      {/* Stats */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-crema dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && asistENCIAS && <AttendanceStats asistENCIAS={asistENCIAS} />}

      {/* Lista */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial</h3>
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-crema dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error al cargar la asistencia</p>
          </div>
        )}
        {!isLoading && !error && asistENCIAS && <AsistenciaList asistENCIAS={asistENCIAS} />}
      </div>
    </div>
  );
}
