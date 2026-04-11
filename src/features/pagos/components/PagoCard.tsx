import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { formatDate } from '@/lib/utils';
import type { Pago } from '@/types';

interface PagoCardProps {
  pago: Pago;
  onClick?: () => void;
}

export function PagoCard({ pago, onClick }: PagoCardProps) {
  const getEstadoBadgeVariant = (): 'success' | 'warning' | 'destructive' => {
    switch (pago.estado) {
      case 'pagado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'anulado':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  const getEstadoLabel = (): string => {
    switch (pago.estado) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'anulado':
        return 'Anulado';
      default:
        return pago.estado;
    }
  };

  return (
    <Card
      variant="clay"
      className="hover:border-gold hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-gray-900">{pago.numero}</p>
            <p className="text-sm text-gray-500">{formatDate(pago.fecha_emision)}</p>
          </div>
          <Badge variant={getEstadoBadgeVariant()}>{getEstadoLabel()}</Badge>
        </div>

        {/* Montos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Monto total</span>
            <span className="font-medium">S/ {pago.monto_total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pagado</span>
            <span className="font-medium text-green-600">S/ {pago.monto_pagado}</span>
          </div>
          {pago.saldo_pendiente > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Saldo pendiente</span>
              <span className="font-medium text-red-600">S/ {pago.saldo_pendiente}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <ProgressBar value={pago.monto_pagado} max={pago.monto_total} label="Progreso de pago" />

        {/* Método de pago si está pagado */}
        {pago.metodo_pago && (
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            Pagado vía {pago.metodo_pago}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
