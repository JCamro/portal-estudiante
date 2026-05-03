import React from 'react';

export type HelpContext = 'dashboard' | 'schedule' | 'talleres' | 'attendance' | 'payments' | 'info';

interface HelpItem {
  icon: string;
  title: string;
  text: string;
}

const helpContent: Record<HelpContext, { title: string; items: HelpItem[] }> = {
  dashboard: {
    title: 'Tu Panel Principal',
    items: [
      { icon: '📅', title: 'Mi Horario', text: 'Ves todas tus clases de la semana. Cada color es un taller distinto. Tocá una clase para ver más detalles.' },
      { icon: '🎵', title: 'Mis Talleres', text: 'Acá están tus matrículas activas. La barra muestra cuántas clases ya tomaste. Si ves "Sin procesar", secretaría aún no generó tu recibo.' },
      { icon: '💰', title: 'Mis Pagos', text: 'Todos tus recibos en un solo lugar. Pendientes, pagados y el historial completo.' },
      { icon: '🔄', title: 'Cambiar de ciclo', text: 'Si tenés varios ciclos (anual, verano), podés cambiar desde el selector arriba a la derecha.' },
    ],
  },
  schedule: {
    title: 'Mi Horario Semanal',
    items: [
      { icon: '🎨', title: 'Colores por taller', text: 'Cada taller tiene su propio color. La leyenda abajo te ayuda a identificarlos.' },
      { icon: '👆', title: 'Tocá una clase', text: 'Al tocar cualquier bloque de horario, vas directo al detalle de esa matrícula.' },
      { icon: '📱', title: 'En el celular', text: 'Deslizá horizontalmente para ver todos los días. Los horarios se adaptan a tu pantalla.' },
    ],
  },
  talleres: {
    title: 'Mis Talleres',
    items: [
      { icon: '📊', title: 'Barra de progreso', text: 'Muestra el porcentaje de clases que ya tomaste. Verde = vas bien, dorado = a mitad, naranja = recién empezando.' },
      { icon: '⚠️', title: 'Sin procesar', text: 'Significa que secretaría aún no generó tu recibo. Es normal los primeros días. Una vez procesado, podrás ver tus asistencias y pagos.' },
      { icon: '✅', title: 'Culminada', text: 'Talleres que ya completaste. Podés entrar igual para ver tu historial.' },
    ],
  },
  attendance: {
    title: 'Asistencias',
    items: [
      { icon: '✅', title: 'Presente (verde)', text: 'Asististe a la clase. ¡Bien!' },
      { icon: '⚠️', title: 'Ausente (amarillo)', text: 'Faltaste a esta clase. Las ausencias afectan tu porcentaje.' },
      { icon: '❌', title: 'Falta grave (rojo)', text: 'Ausencia sin aviso previo. Acumular varias puede tener consecuencias.' },
      { icon: '📈', title: 'Porcentaje', text: 'El porcentaje general de asistencia del taller. Arriba del 80% es excelente.' },
    ],
  },
  payments: {
    title: 'Pagos y Recibos',
    items: [
      { icon: '📄', title: 'Recibo pendiente', text: 'Tenés un recibo por pagar. Contactá a secretaría para realizar el pago.' },
      { icon: '✅', title: 'Recibo pagado', text: 'Este recibo ya está cancelado. ¡Todo al día!' },
      { icon: '🏷️', title: 'Descuentos', text: 'Si ves un porcentaje de descuento, es porque aplicaste a un combo o promoción (ej: 2 instrumentos).' },
      { icon: '⏳', title: 'Sin procesar', text: 'Esta matrícula aún no tiene recibo. Pasos: ① Completar matrícula → ② Secretaría genera recibo → ③ Ves tus pagos acá.' },
    ],
  },
  info: {
    title: 'Detalle de Matrícula',
    items: [
      { icon: '📊', title: 'Progreso de sesiones', text: 'Cuántas clases ya tomaste, cuántas te quedan y el total contratado.' },
      { icon: '📅', title: 'Horarios', text: 'Los días y horarios en que tenés clase para este taller.' },
      { icon: '📋', title: 'Asistencias', text: 'El historial completo de tus asistencias en este taller.' },
      { icon: '💰', title: 'Pagos', text: 'El recibo asociado a esta matrícula. Si aún no hay, verás el paso a paso.' },
    ],
  },
};

interface HelpModalProps {
  isOpen: boolean;
  context: HelpContext;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, context, onClose }) => {
  if (!isOpen) return null;

  const content = helpContent[context] || helpContent.dashboard;

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="help-header">
          <h2>{content.title}</h2>
          <button className="help-close" onClick={onClose} aria-label="Cerrar ayuda">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="help-items">
          {content.items.map((item, i) => (
            <div key={i} className="help-item">
              <div className="help-item-icon">{item.icon}</div>
              <div className="help-item-text">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="help-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>¿Necesitás más ayuda? Contactá a secretaría del taller.</span>
        </div>
      </div>

      <style>{`
        .help-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          padding: var(--space-4);
        }

        .help-modal {
          background: linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 50%, #141414 100%);
          border: 1px solid var(--color-gold-border);
          border-radius: var(--radius-xl);
          max-width: 440px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.08);
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }

        .help-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-5) var(--space-3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .help-header h2 {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          color: var(--color-gold);
          margin: 0;
        }

        .help-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          cursor: pointer;
          padding: var(--space-2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .help-close:hover {
          background: rgba(255, 255, 255, 0.15);
          color: var(--color-text-inverse);
        }

        .help-items {
          padding: var(--space-3) var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .help-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-3);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .help-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 175, 55, 0.15);
        }

        .help-item-icon {
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-sm);
        }

        .help-item-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .help-item-text strong {
          font-size: var(--text-sm);
          color: var(--color-text-inverse);
        }

        .help-item-text p {
          font-size: var(--text-xs);
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          line-height: 1.5;
        }

        .help-footer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-5) var(--space-5);
          font-size: var(--text-xs);
          color: rgba(255, 255, 255, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .help-footer svg {
          flex-shrink: 0;
          opacity: 0.5;
        }

        @media (max-width: 480px) {
          .help-header {
            padding: var(--space-4) var(--space-4) var(--space-2);
          }

          .help-items {
            padding: var(--space-2) var(--space-4);
          }

          .help-footer {
            padding: var(--space-2) var(--space-4) var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(HelpModal);
