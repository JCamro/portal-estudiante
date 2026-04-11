import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Matricula } from '@/types';

interface MatriculasActivasCardProps {
  matriculas: Matricula[];
  isLoading?: boolean;
}

function getSesionesBadgeVariant(
  sesionesDisponibles: number
): 'success' | 'warning' | 'destructive' {
  if (sesionesDisponibles >= 4) return 'success';
  if (sesionesDisponibles >= 2) return 'warning';
  return 'destructive';
}

function getSesionesProgress(sesionesContratadas: number, sesionesDisponibles: number): number {
  if (sesionesContratadas === 0) return 100;
  const usadas = sesionesContratadas - sesionesDisponibles;
  return Math.round((usadas / sesionesContratadas) * 100);
}

export function MatriculasActivasCard({ matriculas, isLoading }: MatriculasActivasCardProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Matrículas Activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-crema dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (matriculas.length === 0) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Matrículas Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No tenés matrículas activas en este momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="clay">
      <CardHeader>
        <CardTitle>Matrículas Activas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matriculas.map((matricula) => {
          const progress = getSesionesProgress(
            matricula.sesiones_contratadas,
            matricula.sesiones_disponibles
          );
          const progresoSesiones = matricula.sesiones_contratadas - matricula.sesiones_disponibles;

          return (
            <div
              key={matricula.id}
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:border-gold hover:shadow-sm transition-all cursor-pointer"
              onClick={() => navigate(`/matriculas/${matricula.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{matricula.taller.nombre}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{matricula.ciclo_nombre}</p>
                </div>
                <Badge variant={getSesionesBadgeVariant(matricula.sesiones_disponibles)}>
                  {matricula.sesiones_disponibles} clases
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{progresoSesiones} clases usadas</span>
                  <span>{matricula.sesiones_contratadas} total</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      progress >= 80
                        ? 'bg-red-500'
                        : progress >= 50
                          ? 'bg-yellow-500'
                          : 'bg-gold'
                    )}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
