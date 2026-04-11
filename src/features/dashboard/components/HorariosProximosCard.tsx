import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getDiaSemana, isToday } from '@/lib/utils';
import type { Horario } from '@/types';
import { cn } from '@/lib/utils';

interface HorariosProximosCardProps {
  horarios: Horario[];
  isLoading?: boolean;
}

export function HorariosProximosCard({ horarios, isLoading }: HorariosProximosCardProps) {
  if (isLoading) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Horarios de la Semana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-crema dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (horarios.length === 0) {
    return (
      <Card variant="clay">
        <CardHeader>
          <CardTitle>Horarios de la Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm text-center py-8">No tenés horarios programados.</p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por día de semana
  const sortedHorarios = [...horarios].sort((a, b) => a.dia_semana - b.dia_semana);

  return (
    <Card variant="clay">
      <CardHeader>
        <CardTitle>Horarios de la Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedHorarios.map((horario) => {
            const esHoy = isToday(horario.dia_semana);

            return (
              <div
                key={horario.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all',
                  esHoy
                    ? 'bg-crema border-l-4 border-l-gold border-gold/20'
                    : 'border-gray-100 hover:border-gold/30'
                )}
              >
                <div className="text-center min-w-[60px]">
                  <div
                    className={cn('text-sm font-medium', esHoy ? 'text-gold' : 'text-gray-900')}
                  >
                    {getDiaSemana(horario.dia_semana)}
                  </div>
                  {esHoy && (
                    <Badge variant="success" className="mt-1 text-xs">
                      Hoy
                    </Badge>
                  )}
                </div>

                <div className="flex-1 border-l border-gray-200 pl-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{horario.taller_nombre}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {horario.hora_inicio} - {horario.hora_fin}
                  </div>
                  <div className="text-xs text-gray-400">{horario.profesor_nombre}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
