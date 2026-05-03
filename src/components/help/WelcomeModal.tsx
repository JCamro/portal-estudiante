import React from 'react';

const WELCOME_KEY = 'portal_welcome_dismissed';

interface WelcomeModalProps {
  userName: string;
  onStartTutorial: () => void;
  onSkip: () => void;
}

export const hasSeenWelcome = (): boolean => {
  try {
    return localStorage.getItem(WELCOME_KEY) === 'true';
  } catch {
    return false;
  }
};

export const dismissWelcome = (): void => {
  try {
    localStorage.setItem(WELCOME_KEY, 'true');
  } catch { /* private mode, ignore */ }
};

const MusicNoteIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const GuitarIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a4 4 0 00-5.66-5.66L7.76 13.4a4 4 0 005.66 5.66z" />
    <line x1="16" y1="8" x2="22" y2="2" />
    <circle cx="10" cy="12" r="1" />
    <circle cx="17" cy="8" r="1" />
  </svg>
);

const CalendarIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const WalletIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4" />
    <path d="M3 5v14a2 2 0 002 2h16v-5" />
    <path d="M18 12a2 2 0 000 4h4v-4z" />
  </svg>
);

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName, onStartTutorial, onSkip }) => {
  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal animate-scale-in">
        {/* Logo */}
        <div className="welcome-logo">
          <img src="/logo-taller.png" alt="Taller de Musica Elguera" />
        </div>

        {/* Greeting */}
        <div className="welcome-greeting">
          <div className="welcome-ornament">
            <span className="ornament-line" />
            <MusicNoteIcon size={16} />
            <span className="ornament-line" />
          </div>
          <h1>{firstName ? `Hola, ${firstName}` : 'Bienvenido'}</h1>
          <p>Este es tu espacio en el Taller de Musica Elguera. Aca puedes seguir tus clases, ver tu progreso y estar al dia con todo.</p>
        </div>

        {/* Feature cards */}
        <div className="welcome-features">
          <div className="welcome-feature">
            <div className="feature-icon"><CalendarIcon size={18} /></div>
            <div className="feature-text">
              <strong>Tu horario</strong>
              <span>Tus clases de la semana, de un vistazo</span>
            </div>
          </div>
          <div className="welcome-feature">
            <div className="feature-icon"><GuitarIcon size={18} /></div>
            <div className="feature-text">
              <strong>Tus talleres</strong>
              <span>Progreso de cada instrumento o taller</span>
            </div>
          </div>
          <div className="welcome-feature">
            <div className="feature-icon"><WalletIcon size={18} /></div>
            <div className="feature-text">
              <strong>Tus pagos</strong>
              <span>Recibos, saldos y todo al dia</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="welcome-actions">
          <button className="welcome-btn welcome-btn-primary" onClick={onStartTutorial}>
            Te muestro como funciona
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button className="welcome-btn welcome-btn-secondary" onClick={onSkip}>
            Ya se como usarlo
          </button>
        </div>
      </div>

      <style>{`
        .welcome-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          padding: var(--space-4);
        }

        .welcome-modal {
          background: linear-gradient(165deg, #0d0d0d 0%, #1a1510 40%, #14100c 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: var(--space-8);
          max-width: 460px;
          width: 100%;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.05);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .welcome-modal::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in { animation: scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1); }

        .welcome-logo {
          margin-bottom: var(--space-4);
          position: relative;
        }

        .welcome-logo img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.3));
        }

        .welcome-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
          color: var(--color-gold);
          opacity: 0.5;
        }

        .ornament-line {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
        }

        .welcome-greeting {
          margin-bottom: var(--space-6);
          position: relative;
        }

        .welcome-greeting h1 {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: var(--color-gold);
          margin: 0 0 var(--space-2);
          letter-spacing: -0.02em;
        }

        .welcome-greeting p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          line-height: 1.55;
        }

        .welcome-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          text-align: left;
          position: relative;
        }

        .welcome-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: all var(--transition-fast);
        }

        .welcome-feature:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 175, 55, 0.12);
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(212, 175, 55, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gold);
          flex-shrink: 0;
        }

        .feature-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .feature-text strong {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }

        .feature-text span {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
        }

        .welcome-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          position: relative;
        }

        .welcome-btn {
          width: 100%;
          padding: 13px var(--space-4);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .welcome-btn-primary {
          background: linear-gradient(135deg, #D4AF37, #B8962E);
          color: #0a0a0a;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
        }

        .welcome-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(212, 175, 55, 0.3);
        }

        .welcome-btn-secondary {
          background: transparent;
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .welcome-btn-secondary:hover {
          color: rgba(255, 255, 255, 0.55);
        }

        @media (max-width: 480px) {
          .welcome-modal {
            padding: var(--space-6);
            border-radius: 16px;
          }

          .welcome-greeting h1 {
            font-size: 1.35rem;
          }

          .welcome-logo img {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(WelcomeModal);
