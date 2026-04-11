import { useState } from 'react';
import { useMatriculas } from '../hooks/useMatriculas';
import { MatriculaCard } from '../components/MatriculaCard';
import { FilterTabs } from '@/components/shared/FilterTabs';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Badge } from '@/components/ui/Badge';

export function MatriculasPage() {
  const [activeTab, setActiveTab] = useState<'activas' | 'historial'>('activas');
  const { data, isLoading, error } = useMatriculas();

  const tabs = [
    { value: 'activas', label: 'Activas' },
    { value: 'historial', label: 'Historial' },
  ];

  const matriculas = activeTab === 'activas' ? data?.activas : data?.concluidas;

  return (
    <div>
      <SectionHeader
        title="Mis Matrículas"
        description="Gestiona tus matrículas y seguimiento de clases"
      />

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(v) => setActiveTab(v as 'activas' | 'historial')}
        />
        {data && (
          <Badge variant="default">
            {activeTab === 'activas' ? data.activas.length : data.concluidas.length} matrícula(s)
          </Badge>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-crema dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar las matrículas</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && matriculas?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {activeTab === 'activas'
              ? 'No tenés matrículas activas en este momento.'
              : 'No hay historial de matrículas.'}
          </p>
        </div>
      )}

      {/* Grid de matrículas */}
      {!isLoading && !error && matriculas && matriculas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {matriculas.map((matricula) => (
            <MatriculaCard key={matricula.id} matricula={matricula} />
          ))}
        </div>
      )}
    </div>
  );
}
