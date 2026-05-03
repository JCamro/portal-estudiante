import React, { useState, useEffect, useCallback } from 'react';

const TUTORIAL_KEY = 'portal_tutorial_completed';

interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
}

const tourSteps: TourStep[] = [
  {
    targetSelector: '#tour-section-toggle',
    title: 'Navegá entre secciones',
    description: 'Usá estos botones para moverte entre tu horario semanal, tus talleres activos y el estado de tus pagos.',
  },
  {
    targetSelector: '#tour-schedule-section',
    title: 'Tu horario semanal',
    description: 'Cada color es un taller distinto. Tocá cualquier bloque de clase para ver los detalles completos: progreso, asistencias, pagos.',
  },
  {
    targetSelector: '#tour-talleres-section',
    title: 'Tus talleres activos',
    description: 'Acá ves todas tus matrículas. La barra muestra cuántas clases ya tomaste. Si ves "Sin procesar", secretaría aún no generó tu recibo.',
  },
  {
    targetSelector: '#tour-pagos-section',
    title: 'Tus pagos',
    description: 'Todos tus recibos en un solo lugar. Pendientes y pagados. Si un taller no tiene recibo, te avisamos acá también.',
  },
  {
    targetSelector: '#tour-help-button, [aria-label="Ayuda"]',
    title: 'Siempre a mano',
    description: 'Este botón "?" te da ayuda en cualquier momento. Según donde estés, te muestra tips específicos de cada sección.',
  },
];

interface TourOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  onSectionChange?: (section: string) => void;
}

export const hasCompletedTutorial = (): boolean => {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markTutorialCompleted = (): void => {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true');
  } catch { /* private mode, ignore */ }
};

const TourOverlay: React.FC<TourOverlayProps> = ({ isActive, onComplete, onSectionChange }) => {
  const [step, setStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});

  const positionTooltip = useCallback((stepIndex: number) => {
    const current = tourSteps[stepIndex];
    const selectors = current.targetSelector.split(',');
    
    // Find the target element
    let el: HTMLElement | null = null;
    for (const sel of selectors) {
      const found = document.querySelector(sel.trim()) as HTMLElement;
      if (found) { el = found; break; }
    }
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltipW = 320;
    const gap = 16;
    const tooltipH = 200; // estimated total height (content + padding + actions)

    // Horizontal: center on element, clamp to viewport
    let left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipW - 16));

    // Vertical: decide position based on available space
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    let top: number;
    let arrowAtTop: boolean;

    if (spaceBelow >= tooltipH || spaceBelow >= spaceAbove) {
      // Below
      top = rect.bottom + gap;
      arrowAtTop = true;
    } else {
      // Above
      top = rect.top - gap - tooltipH;
      arrowAtTop = false;
    }

    // Clamp vertical
    const maxTop = window.innerHeight - tooltipH - 16;
    top = Math.max(16, Math.min(top, maxTop));

    // Arrow position
    const arrowLeft = rect.left + rect.width / 2 - left - 8;
    setArrowStyle(
      arrowAtTop
        ? { left: arrowLeft, top: -8, bottom: 'auto' }
        : { left: arrowLeft, top: 'auto', bottom: -8 }
    );

    setTooltipStyle({ left: `${left}px`, top: `${top}px` });
  }, []);

  useEffect(() => {
    if (!isActive) return;
    positionTooltip(step);

    const handleResize = () => positionTooltip(step);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, step, positionTooltip]);

  useEffect(() => {
    if (!isActive) return;
    // Auto-change section for relevant steps
    if (step === 0) onSectionChange?.('schedule');
    else if (step === 1) onSectionChange?.('schedule');
    else if (step === 2) onSectionChange?.('talleres');
    else if (step === 3) onSectionChange?.('pagos');

    // Small delay to let DOM update + scroll section into view
    const timer = setTimeout(() => {
      const el = document.querySelector(tourSteps[step].targetSelector.split(',')[0]) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => positionTooltip(step), 400);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [step, isActive, onSectionChange, positionTooltip]);

  const handleNext = () => {
    if (step >= tourSteps.length - 1) {
      markTutorialCompleted();
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    markTutorialCompleted();
    onComplete();
  };

  if (!isActive) return null;

  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div className="tour-backdrop" />

      {/* Tooltip card */}
      <div className="tour-tooltip animate-fade-up" style={tooltipStyle}>
        {/* Arrow */}
        <div className="tour-arrow" style={arrowStyle} />

        {/* Progress */}
        <div className="tour-progress">
          {tourSteps.map((_, i) => (
            <div key={i} className={`tour-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
          <span className="tour-step-count">{step + 1}/{tourSteps.length}</span>
        </div>

        {/* Content */}
        <div className="tour-content">
          <h3>{current.title}</h3>
          <p>{current.description}</p>
        </div>

        {/* Actions */}
        <div className="tour-actions">
          {!isLast && (
            <button className="tour-btn-skip" onClick={handleSkip}>
              Saltar
            </button>
          )}
          <button className="tour-btn-next" onClick={handleNext}>
            {isLast ? 'Listo' : 'Siguiente'}
            {!isLast && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .tour-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: 400;
          pointer-events: none;
        }

        .tour-tooltip {
          position: fixed;
          z-index: 500;
          width: 320px;
          max-width: calc(100vw - 32px);
          background: linear-gradient(165deg, #0f0f0f 0%, #1a1510 50%, #14100c 100%);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 14px;
          padding: var(--space-5);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.06);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.3s ease-out; }

        .tour-arrow {
          position: absolute;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #0f0f0f, #1a1510);
          border-left: 1px solid rgba(212, 175, 55, 0.25);
          border-top: 1px solid rgba(212, 175, 55, 0.25);
          transform: rotate(45deg);
        }

        .tour-progress {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: var(--space-3);
        }

        .tour-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .tour-dot.active {
          background: var(--color-gold);
          box-shadow: 0 0 6px rgba(212, 175, 55, 0.4);
          width: 8px;
          height: 8px;
        }

        .tour-dot.done {
          background: rgba(212, 175, 55, 0.3);
        }

        .tour-step-count {
          margin-left: auto;
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tour-content {
          margin-bottom: var(--space-4);
        }

        .tour-content h3 {
          font-family: var(--font-heading);
          font-size: 1.0625rem;
          color: var(--color-gold);
          margin: 0 0 var(--space-2);
          letter-spacing: -0.01em;
        }

        .tour-content p {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          line-height: 1.55;
        }

        .tour-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-2);
        }

        .tour-btn-skip {
          padding: 8px 14px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: color 0.2s;
        }

        .tour-btn-skip:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        .tour-btn-next {
          padding: 8px 18px;
          background: linear-gradient(135deg, #D4AF37, #B8962E);
          border: none;
          border-radius: 8px;
          color: #0a0a0a;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
        }

        .tour-btn-next:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
      `}</style>
    </>
  );
};

export default React.memo(TourOverlay);
