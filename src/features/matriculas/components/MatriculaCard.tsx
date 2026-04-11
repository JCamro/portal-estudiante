import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import type { Matricula } from '@/types';

interface MatriculaCardProps {
  matricula: Matricula;
  onClick?: () => void;
}

export function MatriculaCard({ matricula, onClick }: MatriculaCardProps) {
  const sesionesDisponibles = matricula.sesiones_disponibles;
  const sesionesTotales = matricula.sesiones_contratadas;

  const getSesionesBadgeVariant = (): 'success' | 'warning' | 'destructive' => {
    if (sesionesDisponibles >= 4) return 'success';
    if (sesionesDisponibles >= 2) return 'warning';
    return 'destructive';
  };

  const getEstadoBadgeVariant = (): 'success' | 'default' => {
    return matricula.activo ? 'success' : 'default';
  };

  return (
    <Card
      variant="clay"
      className="hover:border-gold hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{matricula.taller.nombre}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{matricula.ciclo?.nombre}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={getEstadoBadgeVariant()}>
              {matricula.activo ? 'Activa' : 'Concluida'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress de sesiones */}
        <ProgressBar
          value={matricula.sesiones_consumidas}
          max={sesionesTotales}
          label={`${sesionesTotales - sesionesDisponibles} clases usadas`}
          className="[&_.h-full]:!bg-gold"
        />

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Sesiones disponibles</span>
          <Badge variant={getSesionesBadgeVariant()}>{sesionesDisponibles} clases</Badge>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <span className="text-gray-500">Precio total</span>
          <span className="font-medium text-gray-900">S/ {matricula.precio_total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
