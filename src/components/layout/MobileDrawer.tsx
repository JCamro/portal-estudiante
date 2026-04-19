import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface DrawerItem {
  label: string;
  section?: 'schedule' | 'talleres' | 'pagos';
  to?: string;
  icon: React.ReactNode;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: DrawerItem[];
  onSectionChange?: (section: 'schedule' | 'talleres' | 'pagos') => void;
}

const CloseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogoutIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CycleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSectionChange,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cicloActivo = useAuthStore((s) => s.cicloActivo);
  const ciclos = useAuthStore((s) => s.ciclos);
  const setCicloActivo = useAuthStore((s) => s.setCicloActivo);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [showCycleSelector, setShowCycleSelector] = React.useState(false);

  const handleItemClick = (item: DrawerItem) => {
    if (item.section && onSectionChange) {
      onSectionChange(item.section);
      onClose();
    } else if (item.to) {
      navigate(item.to);
      onClose();
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const handleCycleSelect = (ciclo: (typeof ciclos)[number]) => {
    setCicloActivo(ciclo);
    setShowCycleSelector(false);
    onClose();
    // Navigate to home when cycle changes (enrollment IDs are cycle-specific)
    navigate('/', { replace: true });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <img src="/logo-taller.png" alt="Taller de Música Elguera" className="drawer-logo" />
          <div className="drawer-user">
            <span className="user-name">{user?.nombre} {user?.apellido}</span>
            <span className="user-ciclo">{cicloActivo?.nombre || 'Sin ciclo'}</span>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="drawer-nav">
          {items.map((item, index) => (
            <button
              key={index}
              className="drawer-item"
              onClick={() => handleItemClick(item)}
            >
              <span className="drawer-icon">{item.icon}</span>
              <span className="drawer-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="drawer-footer">
          {/* Cycle Selector */}
          {ciclos.length > 1 && (
            <button
              className="drawer-item"
              onClick={() => setShowCycleSelector(!showCycleSelector)}
            >
              <span className="drawer-icon">
                <CycleIcon />
              </span>
              <span className="drawer-label">Cambiar ciclo</span>
              <span className="cycle-check">
                {showCycleSelector ? '▲' : '▼'}
              </span>
            </button>
          )}

          {showCycleSelector && (
            <div className="cycle-selector">
              {ciclos.map((ciclo) => (
                <button
                  key={ciclo.id}
                  className={`cycle-option ${ciclo.id === cicloActivo?.id ? 'active' : ''}`}
                  onClick={() => handleCycleSelect(ciclo)}
                >
                  <span className="cycle-name">{ciclo.nombre}</span>
                  <span className="cycle-badge">
                    {ciclo.tipo === 'anual' ? 'Anual' : ciclo.tipo === 'verano' ? 'Verano' : 'Especial'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Logout */}
          <button className="drawer-item logout" onClick={handleLogout}>
            <span className="drawer-icon">
              <LogoutIcon />
            </span>
            <span className="drawer-label">Cerrar sesión</span>
          </button>
        </div>
      </div>

      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 200;
          animation: fadeIn var(--transition-fast) ease-out;
        }

        .drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          max-width: 85vw;
          background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
          border-right: 1px solid rgba(212, 175, 55, 0.2);
          z-index: 300;
          display: flex;
          flex-direction: column;
          animation: slideInLeft var(--transition-normal) ease-out;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drawer-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: var(--radius-md);
          background: var(--color-surface);
          flex-shrink: 0;
        }

        .drawer-user {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .user-name {
          font-family: var(--font-heading);
          font-size: var(--text-sm);
          color: var(--color-text-inverse);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-ciclo {
          font-size: var(--text-xs);
          color: var(--color-gold);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drawer-close {
          padding: var(--space-2);
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .drawer-close:hover {
          color: var(--color-text-inverse);
        }

        .drawer-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: var(--space-4) 0;
          overflow-y: auto;
        }

        .drawer-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          width: 100%;
          padding: var(--space-4) var(--space-5);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: var(--text-sm);
          font-weight: 500;
          font-family: var(--font-body);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .drawer-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-inverse);
        }

        .drawer-item.active {
          background: var(--color-gold-glow);
          color: var(--color-gold);
          border-right: 3px solid var(--color-gold);
        }

        .drawer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .drawer-icon svg {
          stroke: currentColor;
        }

        .drawer-label {
          flex: 1;
        }

        .cycle-check {
          font-size: 10px;
          color: var(--color-text-muted);
        }

        .drawer-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: var(--space-4) 0;
        }

        .cycle-selector {
          padding: var(--space-2) var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .cycle-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-4);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .cycle-option:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .cycle-option.active {
          border-color: var(--color-gold);
          background: var(--color-gold-glow);
        }

        .cycle-option.active .cycle-name {
          color: var(--color-gold);
        }

        .cycle-name {
          font-size: var(--text-sm);
          color: var(--color-text-inverse);
          font-weight: 500;
        }

        .cycle-badge {
          font-size: 10px;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .logout {
          color: #fca5a5;
        }

        .logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .logout .drawer-icon svg {
          stroke: #fca5a5;
        }
      `}</style>
    </>
  );
};

export default React.memo(MobileDrawer);
