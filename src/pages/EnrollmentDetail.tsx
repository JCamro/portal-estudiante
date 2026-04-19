import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getEnrollments, getSchedules, getAttendance, getPayments, EnrollmentsResponse, EnrollmentRecord, AttendanceRecord, ScheduleRecord, PaymentRecord } from '../api/portal';
import Header from '../components/layout/Header';
import MobileDrawer from '../components/layout/MobileDrawer';
import InfoTab from '../components/detail/InfoTab';
import HorariosTab from '../components/detail/HorariosTab';
import AsistenciaTab from '../components/detail/AsistenciaTab';
import PagosTab from '../components/detail/PagosTab';

type TabId = 'info' | 'horarios' | 'asistencia' | 'pagos';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'info',
    label: 'Info',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    id: 'horarios',
    label: 'Horarios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

const EnrollmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cicloActivo = useAuthStore((s) => s.cicloActivo);

  const [enrollment, setEnrollment] = useState<EnrollmentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('info');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [allSchedules, setAllSchedules] = useState<ScheduleRecord[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cicloActivo || !id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [enrollmentsResponse, schedules, attendance, payments] = await Promise.all([
          getEnrollments(cicloActivo.id),
          getSchedules(cicloActivo.id),
          getAttendance(cicloActivo.id),
          getPayments(cicloActivo.id),
        ]);

        const enrollmentsData = enrollmentsResponse as EnrollmentsResponse;
        const allEnrollments = [...enrollmentsData.activas, ...enrollmentsData.concluidas];
        const found = allEnrollments.find((e) => e.id === parseInt(id, 10));
        setEnrollment(found || null);

        setAllSchedules(schedules);
        setAllAttendance(attendance);
        setAllPayments(payments);
      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cicloActivo, id]);

  // Filter data by enrollment
  const filteredSchedules = useMemo(() => {
    if (!enrollment) return [];
    // Match by taller nombre since schedules don't have matricula_id
    return allSchedules.filter((s) => s.taller_nombre === enrollment.taller?.nombre);
  }, [allSchedules, enrollment]);

  // Filter attendance by taller name (backend doesn't return matricula_id)
  const filteredAttendance = useMemo(() => {
    if (!enrollment || !enrollment.taller?.nombre) return [];
    return allAttendance.filter((a) => a.taller_nombre === enrollment.taller?.nombre);
  }, [allAttendance, enrollment]);

  // Filter payments by taller name (backend returns all payments for the cycle)
  const filteredPayments = useMemo(() => {
    if (!enrollment || !enrollment.taller?.nombre) return allPayments;
    const tallerNombre = enrollment.taller.nombre;
    return allPayments.filter((p) => 
      p.paquetes && p.paquetes.some((nombre) => nombre === tallerNombre)
    );
  }, [allPayments, enrollment]);

  const handleBack = () => {
    navigate('/');
  };

  const drawerItems = [
    {
      label: 'Mis Talleres',
      to: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="enrollment-detail">
        <Header title="Cargando..." showBackButton onBackClick={handleBack} onMenuClick={() => setMobileMenuOpen(true)} />
        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} items={drawerItems} />
        <main className="detail-content">
          <div className="loading-state">
            <div className="skeleton" style={{ height: 200 }} />
            <div className="skeleton" style={{ height: 400 }} />
          </div>
        </main>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="enrollment-detail">
        <Header title="No encontrado" showBackButton onBackClick={handleBack} onMenuClick={() => setMobileMenuOpen(true)} />
        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} items={drawerItems} />
        <main className="detail-content">
          <div className="empty-state">
            <p>No se encontró la matrícula.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="enrollment-detail">
      <Header
        title={enrollment.taller?.nombre ?? 'Detalle'}
        showBackButton
        onBackClick={handleBack}
        onMenuClick={() => setMobileMenuOpen(true)}
      />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} items={drawerItems} />

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
        <div className="tabs-list">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${isActive ? 'tab-btn-active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Tab Content */}
      <main className="detail-content">
        {activeTab === 'info' && <InfoTab enrollment={enrollment} />}
        {activeTab === 'horarios' && <HorariosTab schedules={filteredSchedules} tallerNombre={enrollment.taller?.nombre} />}
        {activeTab === 'asistencia' && <AsistenciaTab attendance={filteredAttendance} />}
        {activeTab === 'pagos' && <PagosTab payments={filteredPayments} />}
      </main>

      <style>{`
        .enrollment-detail {
          min-height: 100vh;
          background: var(--color-bg);
        }

        .tabs-nav {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 80;
        }

        .tabs-list {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tabs-list::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          flex: 1;
          min-width: 80px;
          padding: var(--space-4) var(--space-3);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--color-text-secondary);
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: var(--color-text);
          background: var(--color-surface-hover);
        }

        .tab-btn-active {
          color: var(--color-gold);
          border-bottom-color: var(--color-gold);
        }

        .detail-content {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--space-5);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .tabs-nav {
            top: 0;
            position: relative;
          }

          .tabs-list {
            justify-content: flex-start;
            padding: 0 var(--space-2);
          }

          .tab-btn {
            flex: 0 0 auto;
            padding: var(--space-3) var(--space-4);
            flex-direction: row;
            gap: var(--space-2);
            font-size: var(--text-xs);
          }

          .tab-btn span {
            display: none;
          }

          .tab-btn-active span {
            display: inline;
          }

          .detail-content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(EnrollmentDetail);
