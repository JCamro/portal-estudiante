import React from 'react';
import { PaymentRecord } from '../../api/portal';

interface PagosTabProps {
  payments: PaymentRecord[];
}

const estadoConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pendiente: {
    label: 'Pendiente',
    color: '#92400e',
    bg: 'var(--color-warning-bg)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  pagado: {
    label: 'Pagado',
    color: '#166534',
    bg: 'var(--color-success-bg)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  anulado: {
    label: 'Anulado',
    color: '#666',
    bg: 'var(--color-surface-hover)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
};

const formatMonto = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `S/. ${num.toFixed(2)}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
};

const PagosTab: React.FC<PagosTabProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="pagos-tab">
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <p>No hay recibos registrados para este taller.</p>
        </div>
      </div>
    );
  }

  const pending = payments.filter((r) => r.estado === 'pendiente');
  const paid = payments.filter((r) => r.estado === 'pagado');
  const totalPending = pending.reduce((sum, r) => sum + parseFloat(r.saldo_pendiente || '0'), 0);
  const totalPaid = paid.reduce((sum, r) => sum + parseFloat(r.monto_pagado || '0'), 0);
  const allPaid = pending.length === 0;

  return (
    <div className="pagos-tab">
      {/* Summary Cards */}
      <div className="payments-summary">
        {allPaid ? (
          <div className="summary-card summary-all-paid">
            <div className="summary-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>¡Todo al día!</h3>
              <p>No tienes pagos pendientes</p>
            </div>
          </div>
        ) : (
          <>
            <div className="summary-card summary-pending">
              <div className="summary-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="summary-content">
                <h3>Total pendiente</h3>
                <p className="summary-amount">{formatMonto(totalPending)}</p>
                <span className="summary-count">{pending.length} recibo{pending.length !== 1 ? 's' : ''} pendiente{pending.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="summary-card summary-paid">
              <div className="summary-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="summary-content">
                <h3>Pagado</h3>
                <p className="summary-amount">{formatMonto(totalPaid)}</p>
                <span className="summary-count">{paid.length} recibo{paid.length !== 1 ? 's' : ''} cancelado{paid.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Receipts List */}
      <div className="payments-list stagger-children">
        {payments.map((record) => {
          const config = estadoConfig[record.estado] ?? estadoConfig.pendiente;
          const isPending = record.estado === 'pendiente';

          return (
            <div
              key={record.id}
              className={`payment-card ${isPending ? 'payment-card-pending' : ''}`}
            >
              <div className="payment-card-main">
                {/* Receipt Number & Status */}
                <div className="payment-header">
                  <span className="receipt-number">{record.numero}</span>
                  <span
                    className="receipt-status"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>

                {/* Talleres incluidos */}
                {record.paquetes && record.paquetes.length > 0 && (
                  <div className="payment-talleres">
                    <span className="talleres-label">Talleres:</span>
                    <span className="talleres-list">
                      {record.paquetes.map((nombre, idx) => (
                        <span key={idx} className="taller-tag">
                          {nombre}
                          {idx < record.paquetes.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                {/* Descuento/Promoción */}
                {record.porcentaje_descuento > 0 && (
                  <div className="payment-descuento">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span>Descuento aplicado: {record.porcentaje_descuento}%</span>
                  </div>
                )}

                {/* Meta */}
                <div className="payment-meta">
                  <span className="meta-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatDate(record.fecha_emision)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="payment-amount">
                <span className="amount-total">{formatMonto(record.monto_total)}</span>
                {record.estado === 'pagado' && (
                  <span className="amount-paid">
                    Pagado: {formatMonto(record.monto_pagado)}
                  </span>
                )}
                {record.estado === 'pendiente' && parseFloat(record.saldo_pendiente) > 0 && (
                  <span className="amount-pending">
                    Pendiente: {formatMonto(record.saldo_pendiente)}
                  </span>
                )}
              </div>

              {/* Pending Alert */}
              {isPending && (
                <div className="payment-alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Pago pendiente. Contacta a secretaría.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .pagos-tab {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        /* Summary */
        .payments-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .summary-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-icon.warning {
          background: var(--color-warning-bg);
          color: #92400e;
        }

        .summary-icon.success {
          background: var(--color-success-bg);
          color: #166534;
        }

        .summary-content h3 {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-1);
        }

        .summary-amount {
          font-family: var(--font-heading);
          font-size: var(--text-2xl);
          color: var(--color-text);
          margin: 0;
        }

        .summary-count {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        .summary-all-paid {
          background: var(--color-success-bg);
          border-color: #bbf7d0;
          grid-column: 1 / -1;
        }

        .summary-all-paid .summary-icon {
          background: var(--color-success);
          color: white;
        }

        .summary-all-paid .summary-content h3 {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          color: #166534;
          font-weight: 400;
        }

        .summary-all-paid .summary-content p {
          color: #166534;
          font-size: var(--text-sm);
          margin: 0;
        }

        /* List */
        .payments-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Card */
        .payment-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          transition: all var(--transition-fast);
        }

        .payment-card:hover {
          border-color: var(--color-gold-border);
          box-shadow: var(--shadow-md);
        }

        .payment-card-pending {
          border-left: 4px solid #eab308;
        }

        .payment-card-main {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
        }

        .receipt-number {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          color: var(--color-text);
        }

        .receipt-status {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .payment-talleres {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          font-size: var(--text-xs);
        }

        .talleres-label {
          color: var(--color-text-muted);
        }

        .talleres-list {
          color: var(--color-text-secondary);
        }

        .taller-tag {
          color: var(--color-gold);
        }

        .payment-descuento {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          color: var(--color-gold);
        }

        .payment-meta {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .meta-date {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        /* Amount */
        .payment-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--space-1);
        }

        .amount-total {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          color: var(--color-text);
        }

        .amount-paid {
          font-size: var(--text-xs);
          color: var(--color-success);
        }

        .amount-pending {
          font-size: var(--text-xs);
          color: #eab308;
        }

        /* Alert */
        .payment-alert {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--color-warning-bg);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          color: #92400e;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .summary-card {
            padding: var(--space-4);
          }

          .summary-amount {
            font-size: var(--text-xl);
          }

          .payment-card {
            padding: var(--space-4);
          }

          .payment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-2);
          }

          .payment-amount {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(PagosTab);
