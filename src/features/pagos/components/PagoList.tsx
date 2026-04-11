import { useState } from 'react';
import { PagoCard } from './PagoCard';
import { FilterTabs } from '@/components/shared/FilterTabs';
import type { Pago } from '@/types';

interface PagoListProps {
  pagos: Pago[];
}

export function PagoList({ pagos }: PagoListProps) {
  const [filter, setFilter] = useState<'todos' | 'pendientes' | 'pagados'>('todos');

  const tabs = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendientes', label: 'Pendientes' },
    { value: 'pagados', label: 'Pagados' },
  ];

  const filteredPagos = pagos.filter((pago) => {
    if (filter === 'pendientes') return pago.estado === 'pendiente';
    if (filter === 'pagados') return pago.estado === 'pagado';
    return true;
  });

  return (
    <div className="space-y-4">
      <FilterTabs tabs={tabs} activeTab={filter} onChange={(v) => setFilter(v as typeof filter)} />

      {filteredPagos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filter === 'pendientes'
              ? 'No hay pagos pendientes'
              : filter === 'pagados'
                ? 'No hay pagos realizados'
                : 'No hay pagos registrados'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPagos.map((pago) => (
            <PagoCard key={pago.id} pago={pago} />
          ))}
        </div>
      )}
    </div>
  );
}
