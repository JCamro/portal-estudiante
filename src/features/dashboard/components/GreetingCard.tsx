import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface GreetingCardProps {
  nombre?: string;
  cicloActivo?: string;
}

export function GreetingCard({ nombre, cicloActivo }: GreetingCardProps) {
  const fechaActual = formatDate(new Date());

  return (
    <Card variant="clay" className="bg-gradient-to-r from-gold to-gold-dark border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 font-righteous">¡Hola, {nombre || 'Estudiante'}!</h2>
            <p className="text-white/80 text-sm sm:text-base">{fechaActual}</p>
          </div>
          {cicloActivo && (
            <Badge
              variant="default"
              className="bg-white/20 text-white border-0 hover:bg-white/30 self-start sm:self-auto font-medium"
            >
              {cicloActivo}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
