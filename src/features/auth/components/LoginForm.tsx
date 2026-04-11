import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';

// Schema de validación DNI - coinciding with backend: alphanumeric, 7-15 chars
const dniSchema = z.object({
  dni: z
    .string()
    .min(7, 'El DNI debe tener al menos 7 caracteres')
    .max(15, 'El DNI no puede superar los 15 caracteres')
    .regex(/^[A-Za-z0-9]+$/, 'Solo letras y números, sin caracteres especiales'),
});

// Intent throttle constants
const MAX_ATTEMPTS = 5;

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, error, attemptCount, isLocked, clearError } =
    useAuth();

  const [dni, setDni] = useState('');
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Redirect si ya está autenticado - ir a selección de ciclo
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/seleccionar-ciclo', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer para lock
  useEffect(() => {
    if (!isLocked) {
      setLockCountdown(0);
      return;
    }

    const interval = setInterval(() => {
      setLockCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  // Validación en tiempo real
  useEffect(() => {
    if (!touched || dni === '') {
      setValidationError(null);
      return;
    }

    const result = dniSchema.safeParse({ dni });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
    } else {
      setValidationError(null);
    }
  }, [dni, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    clearError();

    const result = dniSchema.safeParse({ dni });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    setValidationError(null);
    await login(dni);
  };

  // Calcular intentos restantes
  const attemptsRemaining = MAX_ATTEMPTS - attemptCount;
  const isDisabled = isLoading || isLocked || validationError !== null;

  // Mostrar countdown de lock
  const showLockAlert = isLocked && lockCountdown > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Alert de error o bloqueo */}
      {showLockAlert && (
        <Alert variant="warning" title="Demasiados intentos">
          <p>El inicio de sesión está bloqueado.</p>
          <p className="font-bold mt-1">Reintentá en {lockCountdown} segundos.</p>
        </Alert>
      )}

      {error && !showLockAlert && (
        <Alert variant="error" title="Error de autenticación">
          {error}
        </Alert>
      )}

      {/* Campo DNI */}
      <div className="space-y-2">
        <Label htmlFor="dni" className="dark:text-gray-300">
          Número de documento
        </Label>
        <Input
          id="dni"
          type="text"
          inputMode="text"
          autoComplete="username"
          maxLength={15}
          placeholder="71234567"
          value={dni}
          onChange={(e) => {
            // Solo permitir letras y números (sin caracteres especiales)
            const value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
            setDni(value);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          disabled={isLoading || isLocked}
          aria-invalid={validationError !== null}
          aria-describedby={validationError ? 'dni-error' : undefined}
          className={validationError ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {validationError && (
          <p id="dni-error" className="text-sm text-red-500">
            {validationError}
          </p>
        )}
      </div>

      {/* Feedback de intentos restantes (solo mostrar si hay intentos fallidos) */}
      {attemptCount > 0 && !isLocked && (
        <p
          className={`text-sm ${
            attemptsRemaining === 1 ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}
        >
          Intentos restantes: {attemptsRemaining}
        </p>
      )}

      {/* Botón de submit */}
      <Button type="submit" className="w-full" disabled={isDisabled} size="lg">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Iniciando sesión...
          </span>
        ) : isLocked ? (
          `Bloqueado (${lockCountdown}s)`
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  );
}
