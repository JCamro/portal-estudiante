import { useMemo } from 'react';
import { isToday } from '@/lib/utils';
import { HorarioCard } from './HorarioCard';
import type { Horario } from '@/types';

interface WeekScheduleProps {
  horarios: Horario[];
}

const HORAS = Array.from({ length: 29 }, (_, i) => {
  const hora = Math.floor(i / 2) + 7;
  const minutos = (i % 2) * 30;
  return `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
});

const DIAS = [
  { num: 1, label: 'Lunes' },
  { num: 2, label: 'Martes' },
  { num: 3, label: 'Miércoles' },
  { num: 4, label: 'Jueves' },
  { num: 5, label: 'Viernes' },
  { num: 6, label: 'Sábado' },
  { num: 0, label: 'Domingo' },
];

function timeToRow(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  const index = (h - 7) * 2 + (m >= 30 ? 1 : 0);
  return index + 2; // +2 for header row
}

function getRowSpan(hora_inicio: string, hora_fin: string): number {
  const [h1, m1] = hora_inicio.split(':').map(Number);
  const [h2, m2] = hora_fin.split(':').map(Number);
  const startIndex = (h1 - 7) * 2 + (m1 >= 30 ? 1 : 0);
  const endIndex = (h2 - 7) * 2 + (m2 >= 30 ? 1 : 0);
  return Math.max(endIndex - startIndex, 1);
}

export function WeekSchedule({ horarios }: WeekScheduleProps) {
  const groupedHorarios = useMemo(() => {
    const grouped: Record<number, Horario[]> = {};
    DIAS.forEach((d) => {
      grouped[d.num] = horarios.filter((h) => h.dia_semana === d.num);
    });
    return grouped;
  }, [horarios]);

  return (
    <div className="overflow-x-auto">
      {/* Desktop: Full grid */}
      <div className="min-w-[800px]">
        {/* Header row with day names */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1 mb-2">
          <div className="text-xs text-gray-400 font-medium"></div>
          {DIAS.map((dia) => {
            const esHoy = isToday(dia.num);
            return (
              <div
                key={dia.num}
                className={`text-center py-2 rounded-lg ${
                  esHoy ? 'bg-gold text-white' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <span className={`text-sm font-semibold ${esHoy ? '' : 'text-gray-700 dark:text-gray-300'}`}>
                  {dia.label.slice(0, 3)}
                </span>
                {esHoy && (
                  <span className="block text-xs text-white/80">Hoy</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="relative">
          {/* Time labels column */}
          <div className="grid grid-rows-[repeat(28,32px)] gap-1 absolute left-0 top-0 w-[80px]">
            {HORAS.map((hora, i) => (
              <div
                key={hora}
                className="text-xs text-gray-400 text-right pr-2 flex items-start justify-end"
                style={{ height: '32px' }}
              >
                {i % 2 === 0 ? hora : ''}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="grid grid-cols-[repeat(7,1fr)] gap-1 ml-[88px]">
            {DIAS.map((dia) => {
              const horariosDelDia = groupedHorarios[dia.num] || [];
              return (
                <div key={dia.num} className="relative" style={{ height: '28 * 32px + 27 * 4px' }}>
                  {/* Grid background lines */}
                  <div className="absolute inset-0 grid grid-rows-[repeat(28,32px)] gap-1">
                    {HORAS.map((_, i) => (
                      <div
                        key={i}
                        className={`border-t ${
                          i % 2 === 0 ? 'border-gray-200 dark:border-gray-700' : 'border-dashed border-gray-100 dark:border-gray-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Class cards */}
                  <div className="absolute inset-0">
                    {horariosDelDia.map((horario) => {
                      const rowStart = timeToRow(horario.hora_inicio);
                      const rowSpan = getRowSpan(horario.hora_inicio, horario.hora_fin);
                      const isInstrumento = horario.tipo === 'instrumento';

                      return (
                        <div
                          key={horario.id}
                          className="absolute left-1 right-1 z-10"
                          style={{
                            top: `${(rowStart - 2) * 32 + (rowStart - 2) * 4}px`,
                            height: `${rowSpan * 32 + (rowSpan - 1) * 4}px`,
                          }}
                        >
                          <div
                            className={`h-full rounded-lg p-2 shadow-sm border-l-4 ${
                              isInstrumento
                                ? 'bg-white dark:bg-gray-800 border-gold hover:border-gold-dark'
                                : 'bg-white dark:bg-gray-800 border-purple-500 hover:border-purple-600'
                            } transition-all cursor-pointer`}
                          >
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight truncate">
                              {horario.taller_nombre}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {horario.hora_inicio} - {horario.hora_fin}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {horario.profesor_nombre}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Cards per day */}
      <div className="md:hidden space-y-4">
        {DIAS.map((dia) => {
          const horariosDelDia = groupedHorarios[dia.num] || [];
          if (horariosDelDia.length === 0) return null;

          const esHoy = isToday(dia.num);

          return (
            <div key={dia.num}>
              <div
                className={`flex items-center gap-2 mb-2 pb-2 border-b ${
                  esHoy ? 'border-gold' : 'border-gray-200'
                }`}
              >
                <h3 className={`font-semibold ${esHoy ? 'text-gold' : 'text-gray-900'}`}>
                  {dia.label}
                </h3>
                {esHoy && (
                  <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {horariosDelDia.map((horario) => (
                  <HorarioCard key={horario.id} horario={horario} highlightToday={esHoy} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
