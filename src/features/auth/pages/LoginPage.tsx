import { GraduationCap } from 'lucide-react';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-crema to-white dark:from-gray-900 dark:to-gray-800 px-4">
      {/* Theme Toggle - esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Logo y título */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-gold" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-righteous">Portal del Estudiante</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Ingresá tu número de documento para continuar</p>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Portal del Estudiante | Taller de Música Elguera
        </p>
      </footer>
    </div>
  );
}
