import React from 'react';
import { AttendanceRecord } from '../../api/portal';

interface AsistenciaTabProps {
  attendance: AttendanceRecord[];
}

const estadoConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  asistio: {
    label: 'Presente',
    color: '#166534',
    bg: 'var(--color-success-bg)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  falta: {
    label: 'Ausente',
    color: '#991b1b',
    bg: 'var(--color-error-bg)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  falta_grave: {
    label: 'Ausente Grave',
    color: '#7f1d1d',
    bg: '#fee2e2',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
  });
};

const AsistenciaTab: React.FC<AsistenciaTabProps> = ({ attendance }) => {
  if (attendance.length === 0) {
    return (
      <div className="asistencia-tab">
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p>No hay registros de asistencia para este taller.</p>
        </div>
      </div>
    );
  }

  // Sort by date descending
  const sortedAttendance = [...attendance].sort((a, b) => {
    const dateA = new Date(a.fecha + 'T00:00:00');
    const dateB = new Date(b.fecha + 'T00:00:00');
    return dateB.getTime() - dateA.getTime();
  });

  // Stats
  const totalPresentes = sortedAttendance.filter((r) => r.estado === 'asistio').length;
  const totalAusencias = sortedAttendance.filter((r) => r.estado === 'falta' || r.estado === 'falta_grave').length;
  const porcentaje = sortedAttendance.length > 0
    ? Math.round((totalPresentes / sortedAttendance.length) * 100)
    : 0;

  return (
    <div className="asistencia-tab">
      {/* Stats Summary */}
      <div className="attendance-stats">
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--color-success)' }}>{porcentaje}%</span>
          <span className="stat-label">Asistencia</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{sortedAttendance.length}</span>
          <span className="stat-label">Clases</span>
        </div>
        <div className="stat-card stat-highlight">
          <span className="stat-value" style={{ color: 'var(--color-error)' }}>{totalAusencias}</span>
          <span className="stat-label">Ausencias</span>
        </div>
      </div>

      {/* Records List */}
      <div className="attendance-list stagger-children">
        {sortedAttendance.map((record) => {
          const config = estadoConfig[record.estado] ?? estadoConfig.asistio;
          return (
            <div key={record.id} className="attendance-card">
              {/* Date Column */}
              <div className="attendance-date">
                <span className="date-day">{formatDateShort(record.fecha).split(' ')[0]}</span>
                <span className="date-month">{formatDateShort(record.fecha).split(' ')[1]}</span>
              </div>

              {/* Content */}
              <div className="attendance-info">
                <div className="attendance-header">
                  <h4 className="attendance-taller">{record.taller_nombre}</h4>
                  <span
                    className="attendance-estado"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>
                <div className="attendance-meta">
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {record.horario_hora}
                  </span>
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Prof. {record.profesor_nombre}
                  </span>
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {record.horario_dia}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .asistencia-tab {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        /* Stats */
        .attendance-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }

        .stat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .stat-highlight {
          background: var(--color-error-bg);
          border-color: #fecaca;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: var(--text-2xl);
          color: var(--color-text);
          line-height: 1;
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* List */
        .attendance-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        /* Card */
        .attendance-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          display: flex;
          gap: var(--space-4);
          transition: all var(--transition-fast);
        }

        .attendance-card:hover {
          border-color: var(--color-gold-border);
          box-shadow: var(--shadow-md);
        }

        /* Date */
        .attendance-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          padding: var(--space-2);
          background: var(--color-bg);
          border-radius: var(--radius-md);
        }

        .date-day {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          color: var(--color-text);
          line-height: 1;
        }

        .date-month {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          text-transform: uppercase;
        }

        /* Info */
        .attendance-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .attendance-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
        }

        .attendance-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .attendance-taller {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          color: var(--color-text);
          line-height: 1.3;
        }

        .recovery-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px var(--space-2);
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
          border-radius: var(--radius-sm);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .attendance-estado {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
          white-space: nowrap;
        }

        .attendance-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        /* Mobile */
        @media (max-width: 480px) {
          .attendance-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .attendance-stats > :last-child {
            grid-column: span 2;
          }

          .stat-card {
            padding: var(--space-3);
          }

          .stat-value {
            font-size: var(--text-xl);
          }

          .attendance-card {
            padding: var(--space-3);
            gap: var(--space-3);
          }

          .attendance-date {
            min-width: 40px;
            padding: var(--space-1);
          }

          .date-day {
            font-size: var(--text-lg);
          }

          .attendance-header {
            flex-direction: column;
            gap: var(--space-2);
          }

          .attendance-estado {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(AsistenciaTab);
