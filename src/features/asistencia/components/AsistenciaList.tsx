import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Asistencia } from '@/types';

interface AsistenciaListProps {
  asistENCIAS: Asistencia[];
}

const getEstadoBadgeVariant = (
  estado: Asistencia['estado']
): 'success' | 'warning' | 'destructive' => {
  switch (estado) {
    case 'asistio':
      return 'success';
    case 'falta':
      return 'warning';
    case 'falta_grave':
      return 'destructive';
    default:
      return 'warning';
  }
};

const getEstadoLabel = (estado: Asistencia['estado']): string => {
  switch (estado) {
    case 'asistio':
      return 'Asistió';
    case 'falta':
      return 'Falta';
    case 'falta_grave':
      return 'Falta Grave';
    default:
      return estado;
  }
};

export function AsistenciaList({ asistENCIAS }: AsistenciaListProps) {
  if (asistENCIAS.length === 0) {
    return (
      <Card variant="clay">
        <CardContent className="py-8 text-center text-gray-500">
          No hay registros de asistencia
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {asistENCIAS.map((asistencia) => (
        <Card key={asistencia.id} variant="clay">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Fecha y hora */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-crema rounded-lg px-3 py-2 min-w-[70px]">
                    <p className="text-xs text-gray-500 uppercase">
                      {new Date(asistencia.fecha).toLocaleDateString('es-PE', {
                        month: 'short',
                      })}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(asistencia.fecha).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{asistencia.taller_nombre}</p>
                    <p className="text-sm text-gray-500">
                      {asistencia.hora} • {asistencia.profesor_nombre}
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge de estado */}
              <Badge variant={getEstadoBadgeVariant(asistencia.estado)}>
                {getEstadoLabel(asistencia.estado)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
