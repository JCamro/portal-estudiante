import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { Layout } from '@/components/layout';
import { MatriculasPage } from '@/features/matriculas';
import { AsistenciaPage } from '@/features/asistencia';
import { HorariosPage } from '@/features/horarios';
import { PagosPage } from '@/features/pagos';
import { CycleSelectionPage } from '@/features/ciclo-seleccion';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated } = useAuth();

  // HTTPS enforcement en producción
  useEffect(() => {
    const isProduction = import.meta.env.PROD;
    const apiUrl = import.meta.env.VITE_API_URL || '';

    if (isProduction && apiUrl.startsWith('http://')) {
      console.warn(
        '[Security] ADVERTENCIA: La API usa HTTP en producción. ' +
          'Se debe usar HTTPS para proteger las credenciales.'
      );
    }
  }, []);

  return (
    <Routes>
      {/* Ruta de login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/seleccionar-ciclo" replace /> : <LoginPage />}
      />

      {/* Selección de ciclo */}
      <Route
        path="/seleccionar-ciclo"
        element={
          <ProtectedRoute>
            <CycleSelectionPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas con Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/matriculas"
        element={
          <ProtectedRoute>
            <Layout>
              <MatriculasPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/asistencia"
        element={
          <ProtectedRoute>
            <Layout>
              <AsistenciaPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/horarios"
        element={
          <ProtectedRoute>
            <Layout>
              <HorariosPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pagos"
        element={
          <ProtectedRoute>
            <Layout>
              <PagosPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Redirect raíz */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/seleccionar-ciclo' : '/login'} replace />}
      />

      {/* 404 - redirigir a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
