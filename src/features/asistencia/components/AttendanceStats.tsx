import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Asistencia } from '@/types';

interface AttendanceStatsProps {
  asistENCIAS: Asistencia[];
}

export function AttendanceStats({ asistENCIAS }: AttendanceStatsProps) {
  const total = asistENCIAS.length;
  const totalAsistio = asistENCIAS.filter((a) => a.estado === 'asistio').length;
  const totalFaltas = asistENCIAS.filter(
    (a) => a.estado === 'falta' || a.estado === 'falta_grave'
  ).length;
  const totalFaltasGraves = asistENCIAS.filter((a) => a.estado === 'falta_grave').length;
  const porcentajeAsistencia = total > 0 ? Math.round((totalAsistio / total) * 100) : 0;

  // Color coding based on attendance percentage
  const getAttendanceColor = () => {
    if (porcentajeAsistencia >= 80) return 'text-green-600';
    if (porcentajeAsistencia >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total de clases */}
      <Card variant="clay">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 mb-1">Total de Clases</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </CardContent>
      </Card>

      {/* Asistencia */}
      <Card variant="clay">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 mb-1">Asistencia</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${getAttendanceColor()}`}>{porcentajeAsistencia}%</p>
            <Badge variant="success">{totalAsistio} clases</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faltas */}
      <Card variant="clay">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 mb-1">Faltas</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-yellow-600">{totalFaltas}</p>
            <Badge variant="warning">{totalFaltas - totalFaltasGraves} simples</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Faltas graves */}
      <Card variant="clay">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 mb-1">Faltas Graves</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-red-600">{totalFaltasGraves}</p>
            <Badge variant="destructive">{totalFaltasGraves} graves</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
