import React from 'react';
import { EnrollmentRecord } from '../../api/portal';

interface EnrollmentCardProps {
  enrollment: EnrollmentRecord;
  onClick: () => void;
}

const tipoColors: Record<string, { bg: string; border: string; color: string }> = {
  instrumento: { bg: '#dbeafe', border: '#bfdbfe', color: '#1e40af' },
  taller: { bg: '#ede9fe', border: '#ddd6fe', color: '#5b21b6' },
};

const tipoLabel: Record<string, string> = {
  instrumento: 'Instrumento',
  taller: 'Taller',
};

const formatMonto = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `S/. ${num.toFixed(2)}`;
};

const getProgressColor = (pct: number): string => {
  if (pct >= 80) return 'var(--color-success)';
  if (pct >= 50) return 'var(--color-gold)';
  return 'var(--color-warning)';
};

const EnrollmentCard: React.FC<EnrollmentCardProps> = ({ enrollment, onClick }) => {
  const pct = enrollment.sesiones_contratadas > 0
    ? Math.round((enrollment.sesiones_consumidas / enrollment.sesiones_contratadas) * 100)
    : 0;
  const colors = tipoColors[enrollment.taller?.tipo] ?? tipoColors.instrumento;

  return (
    <button className="enrollment-card" onClick={onClick}>
      {/* Header */}
      <div className="enrollment-header">
        <span
          className="tipo-badge"
          style={{
            background: colors.bg,
            color: colors.color,
            borderColor: colors.border,
          }}
        >
          {tipoLabel[enrollment.taller?.tipo] ?? enrollment.taller?.tipo ?? 'Taller'}
        </span>
        {enrollment.concluida && (
          <span className="concluded-badge">Culminada</span>
        )}
      </div>

      {/* Taller Name */}
      <h3 className="enrollment-taller">{enrollment.taller?.nombre ?? 'Taller'}</h3>

      {/* Sessions Progress */}
      {!enrollment.concluida && (
        <div className="sessions-progress">
          <div className="progress-header">
            <span className="progress-label">Sesiones</span>
            <span className="progress-value" style={{ color: getProgressColor(pct) }}>
              {pct}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${pct}%`,
                background: getProgressColor(pct),
              }}
            />
          </div>
          <span className="sessions-count">
            {enrollment.sesiones_consumidas} de {enrollment.sesiones_contratadas} clases
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="enrollment-footer">
        <div className="enrollment-price">
          <span className="price-label">Total</span>
          <span className="price-value">{formatMonto(enrollment.precio_total)}</span>
        </div>
        <span className="cycle-name">{enrollment.ciclo_nombre}</span>
      </div>

      <style>{`
        .enrollment-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          transition: all var(--transition-normal);
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .enrollment-card:hover {
          border-color: var(--color-gold-border);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .enrollment-card:active {
          transform: translateY(0);
        }

        /* Header */
        .enrollment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
        }

        .tipo-badge {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          border: 1px solid;
        }

        .concluded-badge {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          background: var(--color-surface-hover);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
        }

        /* Taller Name */
        .enrollment-taller {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          color: var(--color-text);
          line-height: 1.3;
        }

        /* Progress */
        .sessions-progress {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-label {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        .progress-value {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: 600;
        }

        .progress-bar {
          height: 6px;
          background: var(--color-border-light);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width var(--transition-slow);
        }

        .sessions-count {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        /* Footer */
        .enrollment-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-3);
          padding-top: var(--space-3);
          border-top: 1px solid var(--color-border-light);
        }

        .enrollment-price {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .price-label {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        .price-value {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          color: var(--color-text);
        }

        .cycle-name {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          background: var(--color-surface-hover);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
        }

        /* Mobile */
        @media (max-width: 480px) {
          .enrollment-card {
            padding: var(--space-4);
          }

          .enrollment-taller {
            font-size: var(--text-lg);
          }
        }
      `}</style>
    </button>
  );
};

export default React.memo(EnrollmentCard);
