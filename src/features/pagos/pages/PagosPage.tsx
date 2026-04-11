import { AlertTriangle } from 'lucide-react';
import { usePagos } from '../hooks/usePagos';
import { PagoList } from '../components/PagoList';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Alert } from '@/components/ui/Alert';

export function PagosPage() {
  const { data: pagos, isLoading, error } = usePagos();

  const pagosPendientes = pagos?.filter((p) => p.estado === 'pendiente') || [];
  const totalPendiente = pagosPendientes.reduce((sum, p) => sum + p.saldo_pendiente, 0);

  return (
    <div>
      <SectionHeader title="Mis Pagos" description="Historial y estado de tus pagos" />

      {/* Alerta de pagos pendientes */}
      {!isLoading && pagosPendientes.length > 0 && (
        <Alert variant="warning" className="mb-6 card-clay">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-medium">Tienes {pagosPendientes.length} pago(s) pendiente(s)</p>
              <p className="text-sm">
                Total pendiente: S/ {totalPendiente}. Regulariza tus pagos para mantener tus clases
                activas.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-crema dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar los pagos</p>
        </div>
      )}

      {!isLoading && !error && pagos && <PagoList pagos={pagos} />}
    </div>
  );
}
