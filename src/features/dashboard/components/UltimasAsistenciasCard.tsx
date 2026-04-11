import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatShortDate } from '@/lib/utils';
import type { Asistencia } from '@/types';
import { cn } from '@/lib/utils';

interface UltimasAsistenciasCardProps {
  assistencias: Asistencia[];
  isLoading?: boolean;
}

function getEstadoBadgeVariant(
  estado: Asistencia['estado']
): 'success' | 'destructive' | 'warning' {
  switch (estado) {
    case 'asistio':
      return 'success';
    case 'falta':
      return 'destructive';
    case 'falta_grave':
      return 'destructive';
    default:
      return 'warning';
  }
}

function getEstadoLabel(estado: Asistencia['estado']): string {
  switch (estado) {
    case 'asistio':
      return 'Asistió';
    case 'falta':
      return 'Falta';
    case 'falta_grave':
      return 'Falta grave';
    default:
      return estado;
  }
}

export function UltimasAsistenciasCard({ assistencias, isLoading }: UltimasAsistenciasCardProps) {
  if (isLoading) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Últimas Asistencias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-crema dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (assistencias.length === 0) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Últimas Asistencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No hay registro de assistencias recientes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="clay">
      <CardHeader>
        <CardTitle>Últimas Asistencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {assistencias.map((asistencia, index) => (
            <div
              key={asistencia.id}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg',
                index % 2 === 0 ? 'bg-crema/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {asistencia.taller_nombre}
                  </span>
                  <Badge variant={getEstadoBadgeVariant(asistencia.estado)}>
                    {getEstadoLabel(asistencia.estado)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatShortDate(asistencia.fecha)} • {asistencia.hora}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
