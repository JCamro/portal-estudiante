# Portal Estudiante — Agent Configuration

> Configuración de agentes IA para el proyecto portal-estudiante.
> Este archivo es la fuente de verdad para convenciones, patrones y reglas específicas del proyecto.

---

## Stack Tecnológico

| Capa                | Tecnología                                  |
| ------------------- | ------------------------------------------- |
| **Framework**       | React 18 + TypeScript                       |
| **Bundler**         | Vite 5                                      |
| **Estilos**         | Tailwind CSS 3 (dark mode: `class`)         |
| **Estado global**   | Zustand 4 con devtools                      |
| **Estado servidor** | TanStack Query v5                           |
| **Routing**         | React Router v6                             |
| **Formularios**     | React Hook Form + Zod + @hookform/resolvers |
| **HTTP Client**     | Axios con interceptores JWT                 |
| **Icons**           | Lucide React                                |
| **Linting**         | ESLint + TypeScript plugin                  |
| **Formatting**      | Prettier                                    |

---

## Reglas del Proyecto

### Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- NUNCA agregar "Co-Authored-By" o atribución IA
- Formato: `tipo(alcance): descripción` (ej: `feat(auth): add login with JWT`)

### Código

- **Build**: No ejecutar `build` después de cambios — delegar a CI/CD
- **TypeScript**: Strict mode. NUNCA usar `any`. Tipos explícitos siempre.
- **Prettier**: Ancho de línea 100, single quotes, trailing commas ES5, semicolons
- **ESLint**: `@typescript-eslint/no-unused-vars`: warn con `argsIgnorePattern: "^_"`
- **Imports**: Usar alias `@/` para `src/` (ej: `@/features/auth`)

### Seguridad

- Tokens JWT se almacenan en memoria (Zustand store), NUNCA en localStorage
- API URLs: validar que use HTTPS en producción (ADVERTENCIA en consola si no)
- Mensajes de error genéricos en autenticación — no filtrar información

---

## Arquitectura del Proyecto

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                    # Login, logout, ProtectedRoute
│   │   ├── api/                 # authApi (axios instance)
│   │   ├── components/          # LoginForm
│   │   ├── hooks/              # useAuth (custom hook)
│   │   ├── pages/              # LoginPage
│   │   ├── store/              # authStore (Zustand)
│   │   └── types/              # AuthStore, LoginRequest
│   ├── dashboard/              # Home del estudiante
│   │   ├── api/
│   │   ├── components/         # Cards: Greeting, MatriculasActivas, etc.
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│   ├── matriculas/             # Gestión de matrículas
│   ├── asistencia/              # Control de asistencia
│   ├── horarios/               # Horarios por semana
│   └── pagos/                  # Estados de cuenta
├── components/
│   ├── ui/                     # Componentes base: Button, Input, Card, Badge, Alert, Label, Skeleton
│   ├── layout/                 # Layout, Navbar, ThemeToggle
│   └── shared/                 # Compartidos: DataTable, FilterTabs, SectionHeader, EmptyState, ProgressBar
├── hooks/                      # Custom hooks globales
├── stores/                     # Stores globales (themeStore)
├── api/                        # Axios instance con interceptores JWT
├── lib/                        # Utils: cn() para Tailwind, formatDate(), etc.
└── types/                      # Tipos globales compartidos (Alumno, Ciclo, Matricula, etc.)
```

### Principios de Arquitectura

1. **Feature-based**: Cada feature es autocontenida con su propia lógica
2. **Separación de concerns**: pages → components → hooks → api → store
3. **Estado**: Zustand para estado global (auth, theme), TanStack Query para estado servidor
4. **Componentes UI**: Dumb components, sin lógica de negocio
5. **Custom Hooks**: Encapsulan lógica reutilizable

---

## Convenciones de Código

### Nomenclatura

| Elemento          | Convención          | Ejemplo                                |
| ----------------- | ------------------- | -------------------------------------- |
| Archivos          | kebab-case          | `useAuth.ts`, `login-form.tsx`         |
| Componentes React | PascalCase          | `LoginForm.tsx`, `MatriculaCard.tsx`   |
| Hooks             | camelCase con `use` | `useAuth.ts`, `useMatriculas.ts`       |
| Stores Zustand    | camelCase con `use` | `useAuthStore.ts`, `useThemeStore.ts`  |
| Funciones util    | camelCase           | `formatDate()`, `cn()`                 |
| Types/Interfaces  | PascalCase          | `Alumno`, `Matricula`, `AuthState`     |
| Rutas API         | kebab-case          | `matriculasApi.ts`, `asistenciaApi.ts` |

### Componentes React

```tsx
// Estructura esperada
import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const ComponentName: FC<Props> = ({ className }) => {
  return <div className={cn('base-class', className)}>{/* contenido */}</div>;
};
```

### Imports

```tsx
// Orden recomendado
import { type FC } from 'react'; // React
import { useState, useEffect } from 'react'; // React hooks
import { cn } from '@/lib/utils'; // Utils
import { useAuthStore } from '@/features/auth/store/authStore'; // Stores
import { Button } from '@/components/ui/Button'; // Components
import { LoginPage } from '@/features/auth'; // Features/barrel
```

### Zustand Store

```typescript
// Estructura de store
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // State
      accessToken: null,
      user: null,
      isAuthenticated: false,

      // Actions
      login: async (dni: string) => {
        /* ... */
      },
      logout: () => {
        /* ... */
      },
    }),
    { name: 'auth-store' } // Para devtools
  )
);
```

### API Layer (Axios)

```typescript
// Endpoints: features/{feature}/api/{feature}Api.ts
// Usar api instance de @/api/axios (ya tiene interceptores JWT)
import api from '@/api/axios';
import type { Matricula } from '@/types';

export const matriculasApi = {
  getAll: async (): Promise<Matricula[]> => {
    const { data } = await api.get('/matriculas/');
    return data.results;
  },
};
```

---

## Patrones Establecidos

### Dark Mode

```tsx
// Theme store ya configurado en src/stores/themeStore.ts
// UI ya configurada con dark:前缀
// Toggle disponible en ThemeToggle component

// En componentes:
<div className="dark:bg-gray-900">{/* Se adapta automáticamente */}</div>
```

### Autenticación (JWT en memoria)

```tsx
// Login: usa useAuthStore.login(dni)
// Tokens: almacenados en memory (Zustand), NO localStorage
// Redirect: 401 → logout + redirect a /login
// HTTPS: advertencia en consola si API usa HTTP en PROD

const { isAuthenticated, user } = useAuth();
```

### Formularios con React Hook Form + Zod

```typescript
// Schema de validación
import { z } from 'zod';

export const loginSchema = z.object({
  dni: z.string().min(8, 'DNI debe tener 8 dígitos'),
});
```

### Fetching con TanStack Query

```typescript
// Hook de data fetching
export const useMatriculas = () => {
  return useQuery({
    queryKey: ['matriculas'],
    queryFn: matriculasApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

### cn() — Tailwind Classes

```tsx
// Usar SIEMPRE cn() para combinar clases
import { cn } from '@/lib/utils';

// Bien
<Button className={cn('px-4', isActive && 'bg-blue-500')} />

// Mal
<Button className={`px-4 ${isActive ? 'bg-blue-500' : ''}`} />
```

### Tipos Globales (src/types/index.ts)

```typescript
// Tipos compartidos entre features
// Alumno, Ciclo, Matricula, Asistencia, Horario, Pago
// ApiResponse<T> para paginación
```

---

## Habilidades del Proyecto (Auto-load)

Cuando el contexto involucre estas tecnologías, CARGAR la skill correspondiente ANTES de escribir código.

| Contexto                                                     | Skill                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| React performance, re-renders, memo                          | `vercel-react-best-practices` (ya configurada en `.agents/skills/`) |
| Testing de componentes React                                 | `vercel-react-best-practices` (secciones testing)                   |
| UI/UX, diseño de interfaces, colors, typography, componentes | `ui-ux-pro-max` (`.agents/skills/ui-ux-pro-max/`)                   |

---

## SDD — Spec-Driven Development

### Inicialización

Antes de usar cualquier comando SDD, verificar que `sdd-init` haya sido ejecutado:

1. Buscar en Engram: `sdd-init/portal-estudiante`
2. Si no existe → delegar a `sdd-init` sub-agent primero
3. Solo entonces proceder con comandos SDD

### Workflow

```
proposal → specs → design → tasks → apply → verify → archive
```

### Engram Persistence (Obligatorio)

**Guardar SIEMPRE después de:**

- Decisiones de arquitectura o diseño
- Bugs corregidos (con root cause)
- Patrones establecidos (nomenclatura, estructura)
- Descubrimientos no obvios sobre el codebase
- Preferencias o restricciones del usuario

**Formato:**

```
title: "Breve descripción"
type: bugfix | decision | architecture | discovery | pattern | config
content:
  What: Qué se hizo
  Why: Por qué se tomó esa decisión
  Where: Archivos afectados
  Learned: Gotchas o edge cases
```

---

## Comandos Disponibles

| Comando            | Descripción                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Iniciar dev server en localhost:5173 |
| `npm run build`    | Build para producción                |
| `npm run lint`     | ESLint check                         |
| `npm run lint:fix` | ESLint auto-fix                      |

---

## Notas Importantes

- **API Base URL**: Configurable via `VITE_API_URL` (default: `http://localhost:8000`)
- **Dark Mode**: Implementado con Tailwind `dark:` classes y toggle manual
- **Pagination**: La API usa estilo Django REST (paginated response con `results`)
- **LocalStorage**: Solo para tema (`theme`), NO para tokens
- **ESLint plugins**: `react-hooks/recommended`, `react-refresh`, `@typescript-eslint`

---

_Última actualización: Abril 2026_
