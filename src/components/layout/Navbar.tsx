import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { CicloSelector } from '@/features/dashboard/components/CicloSelector';
import { Music2 } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Inicio' },
    { to: '/matriculas', label: 'Matrículas' },
    { to: '/asistencia', label: 'Asistencia' },
    { to: '/horarios', label: 'Horarios' },
    { to: '/pagos', label: 'Pagos' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Taller <span className="text-gold">Elguera</span></span>
          </div>

          {/* Navegación central */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gold dark:hover:text-gold hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Usuario y controles */}
          <div className="flex items-center gap-4">
            <CicloSelector />
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estudiante</p>
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
