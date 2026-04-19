import React from 'react';
import { ScheduleRecord } from '../../api/portal';

interface HorariosTabProps {
  schedules: ScheduleRecord[];
  tallerNombre?: string;
}

const DIAS_SEMANA = [
  { num: 0, short: 'Dom', full: 'Domingo' },
  { num: 1, short: 'Lun', full: 'Lunes' },
  { num: 2, short: 'Mar', full: 'Martes' },
  { num: 3, short: 'Mié', full: 'Miércoles' },
  { num: 4, short: 'Jue', full: 'Jueves' },
  { num: 5, short: 'Vie', full: 'Viernes' },
  { num: 6, short: 'Sáb', full: 'Sábado' },
];

const defaultColors = { bg: '#dbeafe', border: '#bfdbfe', color: '#1e40af' };

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const HorariosTab: React.FC<HorariosTabProps> = ({ schedules }) => {
  if (schedules.length === 0) {
    return (
      <div className="horarios-tab">
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p>No hay horarios registrados para este taller.</p>
        </div>
      </div>
    );
  }

  // Group by day
  const grouped: Record<number, ScheduleRecord[]> = {};
  schedules.forEach((r) => {
    if (!grouped[r.dia_semana]) grouped[r.dia_semana] = [];
    grouped[r.dia_semana].push(r);
  });

  // Sort each day's records by time
  Object.keys(grouped).forEach((day) => {
    grouped[Number(day)].sort((a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio));
  });

  // Days that have records (excluding Sunday=0)
  const activeDays = [1, 2, 3, 4, 5, 6].filter((d) => grouped[d]?.length > 0);

  return (
    <div className="horarios-tab">
      {/* Weekly Grid View (Desktop) */}
      <div className="schedule-grid hide-mobile">
        <div className="schedule-grid-header">
          {DIAS_SEMANA.filter((d) => d.num !== 0).map((dia) => (
            <div
              key={dia.num}
              className={`grid-day-header ${grouped[dia.num]?.length ? 'has-classes' : ''}`}
            >
              {dia.short}
            </div>
          ))}
        </div>
        <div className="schedule-grid-body">
          {Array.from({ length: 12 }, (_, i) => {
            const hour = 7 + Math.floor(i / 2);
            const minute = (i % 2) * 30;
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const currentMinutes = hour * 60 + minute;

            return (
              <div key={i} className="grid-row">
                <div className="grid-time">{timeStr}</div>
                {[1, 2, 3, 4, 5, 6].map((dia) => {
                  const classAtTime = grouped[dia]?.find((r) => {
                    const start = timeToMinutes(r.hora_inicio);
                    const end = timeToMinutes(r.hora_fin);
                    return currentMinutes >= start && currentMinutes < end;
                  });
                  const isStart = classAtTime && timeToMinutes(classAtTime.hora_inicio) === currentMinutes;

                  return (
                    <div key={dia} className="grid-cell">
                      {isStart && classAtTime && (
                        <div
                          className="grid-class"
                          style={{
                            background: defaultColors.bg,
                            borderColor: defaultColors.border,
                          }}
                        >
                          <span className="class-time">
                            {classAtTime.hora_inicio} - {classAtTime.hora_fin}
                          </span>
                          <span className="class-name">{classAtTime.taller_nombre}</span>
                          <span className="class-teacher">{classAtTime.profesor_nombre}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* List View (Mobile) */}
      <div className="schedule-list hide-desktop stagger-children">
        {activeDays.map((dia) => {
          const diaInfo = DIAS_SEMANA.find((d) => d.num === dia)!;
          return (
            <div key={dia} className="schedule-day">
              <h3 className="day-header">
                <span className="day-name">{diaInfo.full}</span>
                <span className="day-count">{grouped[dia].length} clase{grouped[dia].length !== 1 ? 's' : ''}</span>
              </h3>
              <div className="day-classes">
                {grouped[dia].map((item) => (
                  <div
                    key={item.id}
                    className="schedule-card"
                    style={{
                      borderLeftColor: defaultColors.border,
                      background: defaultColors.bg,
                    }}
                  >
                    <div className="schedule-card-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {item.hora_inicio} — {item.hora_fin}
                    </div>
                    <h4 className="schedule-card-title" style={{ color: defaultColors.color }}>
                      {item.taller_nombre}
                    </h4>
                    <div className="schedule-card-meta">
                      <span className="teacher-name">{item.profesor_nombre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .horarios-tab {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        /* Grid View (Desktop) */
        .schedule-grid {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .schedule-grid-header {
          display: grid;
          grid-template-columns: 60px repeat(6, 1fr);
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg);
        }

        .grid-day-header {
          padding: var(--space-3);
          text-align: center;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .grid-day-header.has-classes {
          color: var(--color-gold);
          background: var(--color-gold-glow);
        }

        .schedule-grid-body {
          max-height: 400px;
          overflow-y: auto;
        }

        .grid-row {
          display: grid;
          grid-template-columns: 60px repeat(6, 1fr);
          min-height: 40px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .grid-row:last-child {
          border-bottom: none;
        }

        .grid-time {
          padding: var(--space-2);
          font-size: var(--text-xs);
          font-family: var(--font-heading);
          color: var(--color-text-muted);
          text-align: center;
          border-right: 1px solid var(--color-border-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-cell {
          border-right: 1px solid var(--color-border-light);
          position: relative;
          min-height: 40px;
        }

        .grid-cell:last-child {
          border-right: none;
        }

        .grid-class {
          position: absolute;
          left: 2px;
          right: 2px;
          top: 2px;
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 1;
          overflow: hidden;
        }

        .class-time {
          font-size: 9px;
          font-family: var(--font-heading);
          opacity: 0.8;
        }

        .class-name {
          font-size: var(--text-xs);
          font-weight: 600;
          line-height: 1.2;
        }

        .class-teacher {
          font-size: 9px;
          opacity: 0.7;
        }

        /* List View (Mobile) */
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .schedule-day {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: var(--space-2);
          border-bottom: 2px solid var(--color-gold-border);
        }

        .day-name {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          color: var(--color-text);
        }

        .day-count {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          background: var(--color-surface);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }

        .day-classes {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .schedule-card {
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          border-left: 4px solid;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .schedule-card-time {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-family: var(--font-heading);
          color: var(--color-text-secondary);
        }

        .schedule-card-title {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          line-height: 1.3;
        }

        .schedule-card-meta {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .teacher-name {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .schedule-grid {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .schedule-list {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(HorariosTab);
