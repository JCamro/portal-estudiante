import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getEnrollments, getSchedules, EnrollmentsResponse, ScheduleRecord } from '../api/portal';
import Header from '../components/layout/Header';
import MobileDrawer from '../components/layout/MobileDrawer';
import EnrollmentCard from '../components/enrollment/EnrollmentCard';

const DIAS_SEMANA = [
  { num: 1, short: 'Lun', full: 'Lunes' },
  { num: 2, short: 'Mar', full: 'Martes' },
  { num: 3, short: 'Mié', full: 'Miércoles' },
  { num: 4, short: 'Jue', full: 'Jueves' },
  { num: 5, short: 'Vie', full: 'Viernes' },
  { num: 6, short: 'Sáb', full: 'Sábado' },
];

const TALLER_COLORS = [
  { bg: '#dbeafe', border: '#93c5fd', color: '#1e40af' },
  { bg: '#ede9fe', border: '#c4b5fd', color: '#5b21b6' },
  { bg: '#dcfce7', border: '#86efac', color: '#166534' },
  { bg: '#fee2e2', border: '#fca5a5', color: '#991b1b' },
  { bg: '#fef3c7', border: '#fcd34d', color: '#92400e' },
  { bg: '#e0e7ff', border: '#a5b4fc', color: '#3730a3' },
  { bg: '#fce7f3', border: '#f9a8d4', color: '#9d174d' },
  { bg: '#ccfbf1', border: '#5eead4', color: '#115e59' },
];

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const cicloActivo = useAuthStore((s) => s.cicloActivo);
  const ciclos = useAuthStore((s) => s.ciclos);
  const setCicloActivo = useAuthStore((s) => s.setCicloActivo);

  const [enrollments, setEnrollments] = useState<EnrollmentsResponse>({ activas: [], concluidas: [] });
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'schedule' | 'talleres'>('schedule');

  // Auto-select ciclo if only one exists
  useEffect(() => {
    if (ciclos.length === 1 && !cicloActivo) {
      setCicloActivo(ciclos[0]);
    }
  }, [ciclos, cicloActivo, setCicloActivo]);

  // Fetch data when cicloActivo is available
  useEffect(() => {
    if (!cicloActivo) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [enrollmentsData, schedulesData] = await Promise.all([
          getEnrollments(cicloActivo.id),
          getSchedules(cicloActivo.id),
        ]);
        if (!cancelled) {
          setEnrollments(enrollmentsData);
          setSchedules(schedulesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!cancelled) {
          setEnrollments({ activas: [], concluidas: [] });
          setSchedules([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [cicloActivo]);

  const handleEnrollmentClick = (enrollmentId: number) => {
    navigate(`/enrollment/${enrollmentId}`);
  };

  const handleScheduleClick = (schedule: ScheduleRecord) => {
    const enrollment = enrollments.activas.find(e => e.taller?.nombre === schedule.taller_nombre);
    if (enrollment) {
      navigate(`/enrollment/${enrollment.id}`);
    }
  };

  const handleCycleSelect = (ciclo: (typeof ciclos)[number]) => {
    setCicloActivo(ciclo);
  };

  const drawerItems = [
    {
      label: 'Mi Horario',
      section: 'schedule' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Mis Talleres',
      section: 'talleres' as const,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ];

  // Group schedules by day
  const schedulesByDay: Record<number, ScheduleRecord[]> = {};
  schedules.forEach((s) => {
    if (!schedulesByDay[s.dia_semana]) schedulesByDay[s.dia_semana] = [];
    schedulesByDay[s.dia_semana].push(s);
  });
  Object.keys(schedulesByDay).forEach((day) => {
    schedulesByDay[Number(day)].sort((a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio));
  });

  // Build taller color map from schedules (unique taller names)
  const tallerColorMap: Record<string, typeof TALLER_COLORS[0]> = {};
  let colorIndex = 0;
  schedules.forEach((s) => {
    if (s.taller_nombre && !tallerColorMap[s.taller_nombre]) {
      tallerColorMap[s.taller_nombre] = TALLER_COLORS[colorIndex % TALLER_COLORS.length];
      colorIndex++;
    }
  });

  // Show cycle selection when no cicloActivo and multiple cycles
  if (!cicloActivo && ciclos.length > 1) {
    return (
      <div className="dashboard-home">
        <Header title="Taller de Música Elguera" onMenuClick={() => setMobileMenuOpen(true)} />
        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} items={drawerItems} />

        <main className="dashboard-content">
          <div className="page-header animate-slide-down">
            <img src="/logo-taller.png" alt="Taller de Música Elguera" className="page-logo" />
            <h1>Selecciona un ciclo</h1>
            <p>Tienes {ciclos.length} ciclos disponibles. Elige con cuál quieres ver tu información.</p>
          </div>

          <div className="cycle-grid stagger-children">
            {ciclos.map((ciclo) => (
              <button
                key={ciclo.id}
                className="cycle-card"
                onClick={() => handleCycleSelect(ciclo)}
              >
                <span
                  className="cycle-badge"
                  style={{
                    background: ciclo.tipo === 'anual' ? '#dbeafe' : ciclo.tipo === 'verano' ? '#fef3c7' : '#ede9fe',
                    color: ciclo.tipo === 'anual' ? '#1e40af' : ciclo.tipo === 'verano' ? '#92400e' : '#5b21b6',
                  }}
                >
                  {ciclo.tipo === 'anual' ? 'Ciclo Anual' : ciclo.tipo === 'verano' ? 'Verano' : 'Especial'}
                </span>
                <h3>{ciclo.nombre}</h3>
                <p className="cycle-dates">
                  {new Date(ciclo.fecha_inicio).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} —{' '}
                  {new Date(ciclo.fecha_fin).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </button>
            ))}
          </div>
        </main>

        <style>{`
          .dashboard-home { min-height: 100vh; background: var(--color-bg); }
          .dashboard-content { max-width: 900px; margin: 0 auto; padding: var(--space-6); }
          .page-header { text-align: center; margin-bottom: var(--space-8); }
          .page-logo { width: 72px; height: 72px; margin: 0 auto var(--space-4); border-radius: var(--radius-lg); }
          .page-header h1 { font-family: var(--font-heading); font-size: var(--text-2xl); color: var(--color-text); margin-bottom: var(--space-2); }
          .page-header p { font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0; }
          .cycle-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-4); }
          .cycle-card { background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-5); text-align: left; cursor: pointer; transition: all var(--transition-normal); display: flex; flex-direction: column; gap: var(--space-3); }
          .cycle-card:hover { border-color: var(--color-gold); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
          .cycle-badge { display: inline-flex; padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; align-self: flex-start; }
          .cycle-card h3 { font-family: var(--font-heading); font-size: var(--text-lg); color: var(--color-text); }
          .cycle-dates { font-size: var(--text-sm); color: var(--color-text-muted); margin: 0; }
          @media (max-width: 480px) { .dashboard-content { padding: var(--space-4); } .cycle-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    );
  }

  // Main dashboard (when cicloActivo is set)
  return (
    <div className="dashboard-home">
      <Header title="Taller de Música Elguera" onMenuClick={() => setMobileMenuOpen(true)} />
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={drawerItems}
        onSectionChange={(section) => setActiveSection(section as 'schedule' | 'talleres')}
      />

      <main className="dashboard-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="skeleton" style={{ height: 400 }} />
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        ) : (
          <>
            {/* Section Toggle */}
            <div className="section-toggle">
              <button
                className={`toggle-btn ${activeSection === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveSection('schedule')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Mi Horario
              </button>
              <button
                className={`toggle-btn ${activeSection === 'talleres' ? 'active' : ''}`}
                onClick={() => setActiveSection('talleres')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Mis Talleres
              </button>
            </div>

            {/* Schedule Section */}
            {activeSection === 'schedule' && (
              <section className="schedule-section animate-fade-in">
                <div className="section-header">
                  <h2>Mi Horario Semanal</h2>
                  <p>Todas tus clases de la semana</p>
                </div>

                {schedules.length === 0 ? (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p>No hay horarios registrados para este ciclo.</p>
                  </div>
                ) : (
                  <div className="schedule-grid">
                    {/* Header row with empty time cell + day names */}
                    <div className="schedule-header-row">
                      <div className="time-header-cell"></div>
                      {DIAS_SEMANA.map((dia) => {
                        const hasClasses = schedulesByDay[dia.num]?.length > 0;
                        return (
                          <div key={dia.num} className={`day-header ${hasClasses ? 'has-classes' : ''}`}>
                            <span className="day-short">{dia.short}</span>
                            <span className="day-full">{dia.full}</span>
                            {hasClasses && <span className="day-count">{schedulesByDay[dia.num].length}</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    <div className="schedule-body">
                      {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => {
                        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                        return (
                          <div key={hour} className="time-row">
                            <div className="time-label">{timeStr}</div>
                            {DIAS_SEMANA.map((dia) => {
                              const classAtSlot = schedulesByDay[dia.num]?.find((s) => {
                                const start = timeToMinutes(s.hora_inicio);
                                const slotStart = hour * 60;
                                return start >= slotStart && start < slotStart + 60;
                              });

                              if (classAtSlot && timeToMinutes(classAtSlot.hora_inicio) === hour * 60) {
                                const colors = tallerColorMap[classAtSlot.taller_nombre] || TALLER_COLORS[0];
                                const duration = timeToMinutes(classAtSlot.hora_fin) - timeToMinutes(classAtSlot.hora_inicio);
                                const heightPx = Math.max(duration, 30);

                                return (
                                  <div key={dia.num} className="slot">
                                    <div
                                      className="class-slot"
                                      style={{ 
                                        background: colors.bg, 
                                        borderColor: colors.border,
                                        height: `${heightPx}px`,
                                        color: colors.color
                                      }}
                                      onClick={() => handleScheduleClick(classAtSlot)}
                                    >
                                      <span className="class-taller">{classAtSlot.taller_nombre}</span>
                                      <span className="class-time">{classAtSlot.hora_inicio} - {classAtSlot.hora_fin}</span>
                                      <span className="class-teacher">{classAtSlot.profesor_nombre}</span>
                                    </div>
                                  </div>
                                );
                              }

                              return <div key={dia.num} className="slot empty-slot" />;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {Object.keys(tallerColorMap).length > 1 && (
                  <div className="taller-legend">
                    <span className="legend-title">Leyenda:</span>
                    {Object.entries(tallerColorMap).map(([taller, colors]) => (
                      <div key={taller} className="legend-item">
                        <span className="legend-dot" style={{ background: colors.bg, borderColor: colors.border }} />
                        <span style={{ color: colors.color }}>{taller}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Talleres Section */}
            {activeSection === 'talleres' && (
              <section className="talleres-section animate-fade-in">
                {enrollments.activas.length > 0 && (
                  <div className="enrollment-group">
                    <h2 className="group-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Matrículas Activas
                    </h2>
                    <div className="enrollment-grid">
                      {enrollments.activas.map((enrollment) => (
                        <EnrollmentCard
                          key={enrollment.id}
                          enrollment={enrollment}
                          onClick={() => handleEnrollmentClick(enrollment.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {enrollments.concluidas.length > 0 && (
                  <div className="enrollment-group">
                    <h2 className="group-title concluded">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Historial
                    </h2>
                    <div className="enrollment-grid">
                      {enrollments.concluidas.map((enrollment) => (
                        <EnrollmentCard
                          key={enrollment.id}
                          enrollment={enrollment}
                          onClick={() => handleEnrollmentClick(enrollment.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {enrollments.activas.length === 0 && enrollments.concluidas.length === 0 && (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <p>No hay matrículas activas para este ciclo.</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      <style>{`
        .dashboard-home { min-height: 100vh; background: var(--color-bg); }
        .dashboard-content { max-width: 1000px; margin: 0 auto; padding: var(--space-5); }
        .loading-container { display: flex; flex-direction: column; gap: var(--space-4); }

        .section-toggle { display: flex; gap: var(--space-2); margin-bottom: var(--space-6); background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-1); border: 1px solid var(--color-border); }
        .toggle-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); background: transparent; border: none; border-radius: var(--radius-md); font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; color: var(--color-text-secondary); cursor: pointer; transition: all var(--transition-fast); }
        .toggle-btn:hover { color: var(--color-text); }
        .toggle-btn.active { background: var(--color-gold); color: #0a0a0a; }
        .toggle-btn.active svg { stroke: #0a0a0a; }

        .schedule-section { display: flex; flex-direction: column; gap: var(--space-4); }
        .section-header { margin-bottom: var(--space-2); }
        .section-header h2 { font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text); margin-bottom: var(--space-1); }
        .section-header p { font-size: var(--text-sm); color: var(--color-text-secondary); margin: 0; }

        .schedule-grid { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); overflow: hidden; }
        
        /* Header row - 7 columns: time + 6 days */
        .schedule-header-row { display: grid; grid-template-columns: 60px repeat(6, 1fr); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
        .time-header-cell { border-right: 1px solid var(--color-border-light); }
        .day-header { padding: var(--space-3); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .day-header.has-classes { background: var(--color-gold-glow); }
        .day-short { font-family: var(--font-heading); font-size: var(--text-sm); color: var(--color-text-muted); }
        .day-full { display: none; font-size: var(--text-xs); color: var(--color-text-muted); }
        .day-count { font-size: 10px; font-weight: 600; color: var(--color-gold); background: var(--color-gold-glow); padding: 1px 6px; border-radius: var(--radius-full); }

        /* Body - scrollable */
        .schedule-body { max-height: 500px; overflow-y: auto; }
        
        /* Time row - 7 columns */
        .time-row { display: grid; grid-template-columns: 60px repeat(6, 1fr); min-height: 60px; border-bottom: 1px solid var(--color-border-light); }
        .time-row:last-child { border-bottom: none; }
        
        .time-label { 
          padding: var(--space-2); 
          font-family: var(--font-heading); 
          font-size: var(--text-xs); 
          color: var(--color-text-muted); 
          display: flex; 
          align-items: flex-start; 
          justify-content: center; 
          border-right: 1px solid var(--color-border-light); 
          background: var(--color-bg);
        }
        
        .slot { 
          border-right: 1px solid var(--color-border-light); 
          padding: 2px; 
          position: relative; 
        }
        .slot:last-child { border-right: none; }
        .empty-slot { min-height: 58px; }

        /* Class block */
        .class-slot { 
          position: absolute;
          left: 2px;
          right: 2px;
          top: 2px;
          border-radius: var(--radius-md); 
          border: 2px solid; 
          padding: var(--space-1) var(--space-2); 
          cursor: pointer; 
          transition: all var(--transition-fast); 
          display: flex; 
          flex-direction: column; 
          gap: 1px; 
          overflow: hidden; 
          z-index: 1;
        }
        .class-slot:hover { transform: scale(1.02); box-shadow: var(--shadow-md); z-index: 2; }
        .class-taller { font-family: var(--font-heading); font-size: 10px; font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .class-time { font-size: 9px; font-weight: 500; opacity: 0.85; }
        .class-teacher { font-size: 9px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .taller-legend { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
        .legend-title { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
        .legend-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-xs); font-weight: 500; }
        .legend-dot { width: 12px; height: 12px; border-radius: var(--radius-sm); border: 2px solid; }

        .talleres-section { display: flex; flex-direction: column; gap: var(--space-8); }
        .enrollment-group { display: flex; flex-direction: column; gap: var(--space-4); }
        .group-title { display: flex; align-items: center; gap: var(--space-2); font-family: var(--font-heading); font-size: var(--text-lg); color: var(--color-text); }
        .group-title.concluded { color: var(--color-text-secondary); }
        .enrollment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4); }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
        .empty-state svg { margin-bottom: var(--space-4); opacity: 0.5; }
        .empty-state p { font-size: var(--text-sm); margin: 0; }

        @media (max-width: 768px) {
          .dashboard-content { padding: var(--space-4); }
          .section-toggle { flex-direction: column; gap: var(--space-1); }
          .toggle-btn { padding: var(--space-3); }
          .schedule-grid { overflow-x: auto; }
          .schedule-header-row { min-width: 650px; }
          .schedule-body { min-width: 650px; }
          .day-short { display: block; }
          .day-full { display: none; }
          .enrollment-grid { grid-template-columns: 1fr; }
        }
        
        @media (min-width: 1024px) {
          .day-short { display: none; }
          .day-full { display: block; font-size: var(--text-xs); color: var(--color-text-muted); }
        }
      `}</style>
    </div>
  );
};

export default React.memo(DashboardHome);
