import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import type { Pago } from '@/types';

interface PagosPendientesAlertProps {
  pagos: Pago[];
}

export function PagosPendientesAlert({ pagos }: PagosPendientesAlertProps) {
  if (pagos.length === 0) {
    return null;
  }

  const montoTotalPendiente = pagos.reduce((acc, pago) => acc + pago.saldo_pendiente, 0);

  return (
    <Alert variant="warning" title="Tenés pagos pendientes">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
        <div>
          <p className="text-sm">
            Monto total pendiente:{' '}
            <span className="font-semibold">S/ {montoTotalPendiente.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {pagos.map((pago) => (
            <div
              key={pago.id}
              className="flex items-center gap-3 text-sm bg-crema dark:bg-gray-800 px-3 py-2 rounded-lg"
            >
              <span className="text-gray-600 dark:text-gray-300">{pago.numero}</span>
              <span className="text-gray-500 dark:text-gray-400">
                S/ {pago.monto_pagado.toFixed(2)} pagados / S/ {pago.saldo_pendiente.toFixed(2)}{' '}
                pendiente
              </span>
              <Badge variant={pago.estado === 'pendiente' ? 'warning' : 'outline'}>
                {pago.estado}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Alert>
  );
}
