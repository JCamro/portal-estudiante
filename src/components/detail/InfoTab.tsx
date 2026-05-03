import React from 'react';
import { EnrollmentRecord } from '../../api/portal';

interface InfoTabProps {
  enrollment: EnrollmentRecord;
}

const formatMonto = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `S/. ${num.toFixed(2)}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getProgressColor = (pct: number): string => {
  if (pct >= 80) return 'var(--color-success)';
  if (pct >= 50) return 'var(--color-gold)';
  return 'var(--color-warning)';
};

const InfoTab: React.FC<InfoTabProps> = ({ enrollment }) => {
  const pct = enrollment.sesiones_contratadas > 0
    ? Math.round((enrollment.sesiones_consumidas / enrollment.sesiones_contratadas) * 100)
    : 0;
  const isNoProcesado = enrollment.estado_calculado === 'no_procesado';

  return (
    <div className="info-tab">
      {/* No Procesada Alert */}
      {isNoProcesado && (
        <div className="no-procesado-alert">
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="alert-content">
            <h3>Matrícula sin procesar</h3>
            <p>Secretaría aún no ha generado tu recibo. Una vez procesado, podrás ver tus sesiones, asistencias y pagos aquí.</p>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="info-card">
        <h3 className="card-title">Progreso de Sesiones</h3>

        <div className="progress-section">
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-value" style={{ color: getProgressColor(pct) }}>{pct}%</span>
              <span className="stat-label">Completado</span>
            </div>
            <div className="stat">
              <span className="stat-value">{enrollment.sesiones_consumidas}</span>
              <span className="stat-label">Consumidas</span>
            </div>
            <div className="stat">
              <span className="stat-value">{enrollment.sesiones_disponibles}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat">
              <span className="stat-value">{enrollment.sesiones_contratadas}</span>
              <span className="stat-label">Contratadas</span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${pct}%`,
                  background: getProgressColor(pct),
                }}
              />
            </div>
          </div>

          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--color-success)' }} />
              <span>80-100%: Excelente</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--color-gold)' }} />
              <span>50-79%: En proceso</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'var(--color-warning)' }} />
              <span>0-49%: Inicio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="info-card">
        <h3 className="card-title">Detalles de la Matrícula</h3>

        <div className="details-list">
          <div className="detail-row">
            <span className="detail-label">Taller</span>
            <span className="detail-value">{enrollment.taller?.nombre ?? '—'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tipo</span>
            <span className="detail-value">
              {enrollment.taller?.tipo === 'instrumento' ? 'Instrumento' : 'Taller'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ciclo</span>
            <span className="detail-value">{enrollment.ciclo_nombre}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fecha de Matrícula</span>
            <span className="detail-value">{formatDate(enrollment.fecha_matricula)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Precio Total</span>
            <span className="detail-value">{formatMonto(enrollment.precio_total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Estado</span>
            <span className={`detail-badge ${isNoProcesado ? 'badge-no-procesado' : enrollment.concluida ? 'badge-concluded' : 'badge-active'}`}>
              {isNoProcesado ? 'Sin procesar' : enrollment.concluida ? 'Culminada' : 'Activa'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .info-tab {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .info-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
        }

        .card-title {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          color: var(--color-text);
          margin-bottom: var(--space-4);
        }

        /* Progress */
        .progress-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--color-bg);
          border-radius: var(--radius-md);
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          color: var(--color-text);
        }

        .stat-label {
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .progress-bar-container {
          padding: var(--space-2) 0;
        }

        .progress-bar {
          height: 12px;
          background: var(--color-border-light);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width var(--transition-slow);
        }

        .progress-legend {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Details */
        .details-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--color-border-light);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        .detail-value {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text);
        }

        .detail-badge {
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
        }

        .badge-active {
          background: var(--color-success-bg);
          color: #166534;
        }

        .badge-concluded {
          background: var(--color-surface-hover);
          color: var(--color-text-muted);
        }

        .badge-no-procesado {
          background: #fef3c7;
          color: #92400e;
        }

        /* No Procesada Alert */
        .no-procesado-alert {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          padding: var(--space-5);
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border: 1px solid #fcd34d;
          border-radius: var(--radius-xl);
          box-shadow: 0 1px 3px rgba(234, 179, 8, 0.15);
        }

        .alert-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d97706;
          flex-shrink: 0;
        }

        .alert-content h3 {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          color: #92400e;
          margin-bottom: var(--space-1);
        }

        .alert-content p {
          font-size: var(--text-sm);
          color: #a16207;
          margin: 0;
          line-height: 1.5;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .progress-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat {
            padding: var(--space-2);
          }

          .stat-value {
            font-size: var(--text-lg);
          }

          .progress-legend {
            flex-direction: column;
            gap: var(--space-2);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(InfoTab);
