import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import EnrollmentDetail from './pages/EnrollmentDetail';

// Protected route: requires full auth session (tokens + user + cicloActivo)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasValidSession = useAuthStore((s) => s.hasValidSession);

  if (!isAuthenticated || !hasValidSession()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route that redirects to dashboard if already authenticated
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasValidSession = useAuthStore((s) => s.hasValidSession);

  if (isAuthenticated && hasValidSession()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />

      {/* Dashboard Home (enrollment cards + cycle selection) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />

      {/* Enrollment Detail */}
      <Route
        path="/enrollment/:id"
        element={
          <ProtectedRoute>
            <EnrollmentDetail />
          </ProtectedRoute>
        }
      />

      {/* Legacy /dashboard redirect to / */}
      <Route
        path="/dashboard"
        element={<Navigate to="/" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const AppShell: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default AppShell;
