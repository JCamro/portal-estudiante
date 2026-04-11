import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CicloCardProps {
  id: number;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const CicloCard = memo(function CicloCard({
  id,
  nombre,
  tipo,
  fecha_inicio,
  fecha_fin,
  activo,
  onSelect,
  isSelected,
}: CicloCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const tipoBadgeVariant = tipo === 'anual' ? 'default' : tipo === 'verano' ? 'warning' : 'outline';

  return (
    <div
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-gold ring-2 ring-gold/20' 
          : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
        }
      `}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-righteous">
            {nombre}
          </h3>
          <Badge variant={tipoBadgeVariant} className="mt-1">
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </Badge>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Inicio: {formatDate(fecha_inicio)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Fin: {formatDate(fecha_fin)}</span>
        </div>
      </div>

      {/* Status */}
      {activo && (
        <div className="mb-4">
          <span className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></span>
            Ciclo activo
          </span>
        </div>
      )}

      {/* Select button */}
      <Button
        variant={isSelected ? 'outline' : 'gold'}
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        {isSelected ? 'Seleccionado' : 'Seleccionar'}
      </Button>
    </div>
  );
});

export function CycleSelectionPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const ciclos = useAuthStore((state) => state.ciclos);
  const selectedCicloId = useAuthStore((state) => state.selectedCicloId);
  const setSelectedCicloId = useAuthStore((state) => state.setSelectedCicloId);

  // Auto-select if only 1 ciclo (but show page, don't auto-skip)
  useEffect(() => {
    if (ciclos && ciclos.length === 1) {
      const singleCiclo = ciclos[0];
      if (!selectedCicloId || selectedCicloId !== singleCiclo.id) {
        setSelectedCicloId(singleCiclo.id);
      }
    }
  }, [ciclos, selectedCicloId, setSelectedCicloId]);

  const handleSelectCiclo = (cicloId: number) => {
    setSelectedCicloId(cicloId);
  };

  const handleConfirm = () => {
    if (selectedCicloId) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleBack = () => {
    useAuthStore.getState().logout();
    navigate('/login', { replace: true });
  };

  if (!ciclos || ciclos.length === 0) {
    return (
      <div className="min-h-screen bg-crema dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No hay ciclos disponibles</p>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crema dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-righteous">
                Selecciona un Ciclo
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hola, {user?.nombre} {user?.apellido}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Elegí el ciclo académico con el que querés trabajar
        </p>

        {/* Cycle grid */}
        <div className="grid gap-6 auto-fit_cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {ciclos.map((ciclo) => (
            <CicloCard
              key={ciclo.id}
              id={ciclo.id}
              nombre={ciclo.nombre}
              tipo={ciclo.tipo}
              fecha_inicio={ciclo.fecha_inicio}
              fecha_fin={ciclo.fecha_fin}
              activo={ciclo.activo}
              onSelect={handleSelectCiclo}
              isSelected={selectedCicloId === ciclo.id}
            />
          ))}
        </div>

        {/* Confirm button */}
        {ciclos.length >= 1 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="gold"
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedCicloId}
              className="min-w-48"
            >
              Continuar
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
