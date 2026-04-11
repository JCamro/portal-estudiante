import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getDiaSemana } from '@/lib/utils';
import type { Horario } from '@/types';

interface HorarioCardProps {
  horario: Horario;
  highlightToday?: boolean;
}

export function HorarioCard({ horario, highlightToday = false }: HorarioCardProps) {
  const isInstrumento = horario.tipo === 'instrumento';

  return (
    <Card
      variant="clay"
      className={`
        ${highlightToday ? 'ring-2 ring-gold' : ''}
        transition-all overflow-hidden
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-1 h-6 rounded-full ${
                isInstrumento ? 'bg-gold' : 'bg-purple-500'
              }`}
            />
            <Badge variant={highlightToday ? 'default' : 'outline'} className={highlightToday ? 'bg-gold/10 text-gold border-gold/30' : ''}>
              {getDiaSemana(horario.dia_semana)}
            </Badge>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {horario.hora_inicio} - {horario.hora_fin}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{horario.taller_nombre}</h4>
        <p className="text-sm text-gray-500">
          {horario.profesor_nombre} • {horario.salon}
        </p>
      </CardContent>
    </Card>
  );
}
