import { useAuthStore } from '@/features/auth/store/authStore';
import { ChevronDown } from 'lucide-react';
import type { CicloInfo } from '@/features/auth/types';

export function CicloSelector() {
  const ciclos = useAuthStore((state) => state.ciclos);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);
  const setSelectedCicloId = useAuthStore((state) => state.setSelectedCicloId);

  if (!ciclos || ciclos.length === 0) {
    return null;
  }

  // Si solo hay un ciclo, no mostrar selector
  if (ciclos.length === 1) {
    const ciclo = ciclos[0];
    return (
      <span className="text-sm bg-gold/10 text-gold px-3 py-1 rounded-full font-medium">
        {ciclo.nombre}
        {ciclo.has_matricula_activa && (
          <span className="ml-1.5 inline-flex items-center text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full">
            ● Activo
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="ciclo-selector" className="text-sm text-gray-500 dark:text-gray-400">
        Ciclo:
      </label>
      <div className="relative">
        <select
          id="ciclo-selector"
          value={selectedCicloId ?? ''}
          onChange={(e) => setSelectedCicloId(Number(e.target.value) || null)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold cursor-pointer"
        >
          {ciclos.map((ciclo: CicloInfo) => (
            <option key={ciclo.id} value={ciclo.id}>
              {ciclo.nombre}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
