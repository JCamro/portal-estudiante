# Portal Estudiante — Agent Configuration

> Configuración de agentes IA para el proyecto portal-estudiante.
> Este archivo es la fuente de verdad para convenciones, patrones y reglas específicas del proyecto.

---

## Stack Tecnológico

| Capa                | Tecnología                                  |
| ------------------- | ------------------------------------------- |
| **Framework**       | React 19 + TypeScript 5.9                   |
| **Bundler**         | Vite 6                                      |
| **Estilos**         | CSS Variables + Inline Styles (NO Tailwind) |
| **Estado global**   | Zustand 5 (sin devtools)                    |
| **Routing**         | React Router v7                             |
| **HTTP Client**     | Axios con interceptores JWT                 |
| **Idioma**          | Español (todo UI en español)                |
| **Timezone**        | `America/Lima`                              |

---

## Arquitectura del Proyecto

```
portal-estudiante/
├── public/
│   └── logo-taller.png          # Logo del Taller de Música Elguera
├── src/
│   ├── api/
│   │   ├── axios.ts             # Axios instance con interceptores JWT (auto-refresh)
│   │   └── portal.ts            # API functions + TypeScript interfaces
│   ├── components/
│   │   ├── detail/              # Tabs de detalle de matrícula
│   │   │   ├── InfoTab.tsx      # Info general + progreso de sesiones
│   │   │   ├── HorariosTab.tsx  # Grid de horarios semanal
│   │   │   ├── AsistenciaTab.tsx # Registro de asistencias
│   │   │   └── PagosTab.tsx     # Recibos y pagos
│   │   ├── enrollment/          # Componentes de matrícula
│   │   │   └── EnrollmentCard.tsx
│   │   ├── help/                # Onboarding y ayuda
│   │   │   ├── WelcomeModal.tsx # Modal primera visita (Ver tutorial / Saltar)
│   │   │   ├── TourOverlay.tsx  # Tour guiado con spotlight tooltips
│   │   │   └── HelpModal.tsx    # Ayuda contextual (6 contextos)
│   │   └── layout/              # Layout components
│   │       ├── Header.tsx       # Header con selector de ciclo + hamburger
│   │       └── MobileDrawer.tsx # Drawer de navegación móvil
│   ├── hooks/
│   │   └── useWindowWidth.ts    # Hook para breakpoint detection
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login con DNI
│   │   ├── DashboardHome.tsx    # Home con grid semanal + tarjetas de matrícula
│   │   └── EnrollmentDetail.tsx # Detalle de matrícula con 4 tabs
│   ├── stores/
│   │   └── authStore.ts         # Zustand auth store (en memoria, NO localStorage)
│   ├── styles/
│   │   └── globals.css          # Design system con CSS variables
│   ├── utils/
│   │   ├── timezone.ts          # UTC↔Lima date helpers
│   │   └── formatters.ts        # Shared formatters (formatMonto)
│   ├── AppShell.tsx             # Router + ProtectedRoute
│   ├── main.tsx                 # Vite entry point
│   └── index.css                # Reset + base styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Design System (CSS Variables)

```css
/* Colores - Paleta oscura elegante */
--color-bg: #f9fafb;              /* Fondo principal */
--color-surface: #ffffff;         /* Cards, modals */
--color-surface-hover: #f3f4f6;   /* Hover state */
--color-border: #e5e7eb;          /* Bordes */
--color-text: #111827;            /* Texto principal */
--color-text-secondary: #6b7280;  /* Texto secundario */
--color-text-muted: #9ca3af;      /* Texto muted */
--color-text-inverse: #ffffff;    /* Texto sobre fondos oscuros */

/* Sidebar/Header - Fondo oscuro */
--color-sidebar: #0a0a0a;         /* Fondo sidebar */
--color-sidebar-hover: #141414;   /* Hover sidebar */

/* Acento dorado */
--color-gold: #D4AF37;
--color-gold-light: #E5C158;
--color-gold-dark: #B8962E;
--color-gold-border: rgba(212, 175, 55, 0.3);

/* Estados */
--color-success: #10b981;
--color-success-bg: rgba(16, 185, 129, 0.1);
--color-warning: #f59e0b;
--color-warning-bg: rgba(245, 158, 11, 0.1);
--color-error: #ef4444;
--color-error-bg: rgba(239, 68, 68, 0.1);

/* Tipografía */
--font-heading: 'Righteous', cursive;
--font-body: 'Poppins', sans-serif;

/* Espaciado */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Border radius */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;

/* Breakpoints */
--breakpoint-sm: 480px;
--breakpoint-md: 768px;
```

---

## Reglas del Proyecto

### Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- NUNCA agregar "Co-Authored-By" o atribución IA
- Solo commit cuando el usuario lo pida explícitamente

### Código

- **Build**: NUNCA ejecutar build después de cambios (delegar al usuario)
- **TypeScript**: Strict mode. Tipos explícitos siempre.
- **Idioma**: Todo UI en español. Nombres de variables en inglés, labels en español.
- **Estilos**: CSS variables + inline styles. NO Tailwind, NO CSS modules.
- **Performance**: TODOS los componentes de página envueltos en `memo()`

### Seguridad

- Tokens JWT en memoria (Zustand store), NO localStorage
- `localStorage` solo como fallback con try-catch (falla en private mode)
- Axios interceptor maneja auto-refresh de tokens

---

## API Backend (sistema-asistencia-taller)

El portal consume la API del backend Django en `sistema-asistencia-taller/`.

### Base URL

```
VITE_API_URL=http://localhost:8000/api  (default)
```

### Endpoints del Portal

```
POST /api/portal/auth/login/              # Login con DNI (retorna tokens + user + ciclos)
POST /api/portal/auth/refresh/            # Refresh token
POST /api/portal/auth/logout/             # Blacklist token
GET  /api/portal/me/                      # Perfil del estudiante
GET  /api/portal/me/matriculas/?ciclo_id=X  # Matrículas (activas + concluidas)
GET  /api/portal/me/horarios/?ciclo_id=X   # Horarios del ciclo
GET  /api/portal/me/asistencias/?ciclo_id=X # Asistencias del ciclo
GET  /api/portal/me/pagos/?ciclo_id=X      # Recibos del ciclo
GET  /api/portal/me/dashboard/?ciclo_id=X  # Stats del dashboard
```

### Campos Importantes del Backend

**Matriculas response:**
```json
{
  "activas": [...],
  "concluidas": [...]
}
```
Cada matrícula:
```json
{
  "id": 1,
  "taller": { "id": 1, "nombre": "Guitarra", "tipo": "instrumento" },
  "ciclo_nombre": "2024-I",
  "sesiones_contratadas": 12,
  "sesiones_disponibles": 8,
  "sesiones_consumidas": 4,
  "concluida": false,
  "precio_total": "240.00",
  "fecha_matricula": "2024-01-15"
}
```

**Asistencias response:**
```json
{
  "id": 1,
  "fecha": "2024-01-15",
  "hora": "10:00",
  "estado": "asistio",
  "taller_nombre": "Guitarra",
  "horario_dia": "Lunes",
  "horario_hora": "10:00-11:00",
  "profesor_nombre": "Pérez, Juan",
  "matricula": 42
}
```
✅ **Incluye `matricula` (FK numérico)** — filtrar por `matricula` en frontend para evitar mezclar asistencias de matrículas del mismo taller.

**Pagos/Recibos response:**
```json
{
  "id": 1,
  "numero": "REC-2024-0001",
  "monto_total": "290.00",
  "monto_pagado": "0.00",
  "saldo_pendiente": "290.00",
  "estado": "pendiente",
  "fecha_emision": "2024-01-15",
  "porcentaje_descuento": 9.4,
  "paquetes": ["Guitarra", "Batería"]
}
```
⚠️ **`paquetes` es un array de nombres de talleres**, no un string.

---

## Patrones Establecidos

### Autenticación

```tsx
// Login flow
1. POST /portal/auth/login/ { dni } → { access, refresh, user, ciclos }
2. Guardar tokens en Zustand store (en memoria)
3. Si 1 ciclo → seleccionar automáticamente y ir a /
4. Si múltiples ciclos → ir a / para selección

// Protected routes
- Verificar: isAuthenticated + accessToken + refreshToken + user
- NO verificar cicloActivo (ese es para páginas internas)
```

### Filtro de Datos por Matrícula

El backend ahora devuelve `matricula` (FK numérico) en cada registro de asistencia:

```tsx
// Filtrar por matricula_id (preciso, soporta re-matrículas del mismo taller)
const filteredAttendance = useMemo(() => {
  if (!enrollment) return [];
  return allAttendance.filter((a) => a.matricula === enrollment.id);
}, [allAttendance, enrollment]);
```

### Responsive Design

```tsx
// Breakpoints
- Mobile: < 480px → Cards, single column
- Tablet: 480px – 768px → Cards, 1-2 columns
- Desktop: > 768px → Full table layout

// Componentes
- useWindowWidth() → hook para JS-side breakpoints
- ResponsiveTable → Table on desktop, cards on mobile (threshold: 768px)
- DataCard → Sub-component for mobile card rows

// Touch targets
- Mínimo 44px height para elementos interactivos
- Clase CSS: .touch-target
```

### Navigation Flow

```
Login → / (selección de ciclo si hay múltiples) → / → Dashboard → sidebar
```

- Al cambiar ciclo → navegar a `/` para evitar errores "No encontrado"
- Hamburger menu en móvil → MobileDrawer con navegación + selector de ciclo

---

## Convenciones de Código

### Nomenclatura

| Elemento          | Convención          | Ejemplo                                |
| ----------------- | ------------------- | -------------------------------------- |
| Archivos          | PascalCase (tsx)    | `LoginPage.tsx`, `EnrollmentCard.tsx`  |
| Archivos utils    | camelCase (ts)      | `formatters.ts`, `timezone.ts`         |
| Componentes React | PascalCase          | `Header.tsx`, `PagosTab.tsx`           |
| Hooks             | camelCase con `use` | `useWindowWidth.ts`                    |
| Stores Zustand    | camelCase           | `authStore.ts`                         |
| Funciones util    | camelCase           | `formatMonto()`, `formatDate()`        |
| Types/Interfaces  | PascalCase          | `PaymentRecord`, `EnrollmentRecord`    |

### Componentes React

```tsx
// Estructura estándar
import React, { memo } from 'react';

interface Props {
  // props
}

const ComponentName: React.FC<Props> = ({ /* props */ }) => {
  return (
    <div>
      {/* contenido */}
      <style>{`
        .className {
          /* estilos */
        }
      `}</style>
    </div>
  );
};

export default memo(ComponentName);
```

### Zustand Store (sin devtools)

```typescript
// authStore.ts
import { create } from 'zustand';

interface AuthState {
  // State
  accessToken: string | null;
  user: User | null;
  cicloActivo: Ciclo | null;
  
  // Actions
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  accessToken: null,
  user: null,
  cicloActivo: null,
  
  // Actions
  setTokens: (access, refresh) => set({ accessToken: access }),
  setUser: (user) => set({ user }),
  logout: () => set({ accessToken: null, user: null, ciclos: [], cicloActivo: null }),
}));
```

### API Layer (Axios)

```typescript
// api/portal.ts
import api from './axios';

export interface PaymentRecord {
  id: number;
  numero: string;
  monto_total: string;
  // ... otros campos
}

export const getPayments = async (cicloId: number): Promise<PaymentRecord[]> => {
  const response = await api.get<PaymentRecord[]>(
    `/portal/me/pagos/?ciclo_id=${cicloId}`
  );
  return response.data;
};
```

---

## Habilidades del Proyecto (Auto-load)

| Contexto                                    | Skill                                    |
| ------------------------------------------- | ---------------------------------------- |
| React performance, re-renders, memo         | `vercel-react-best-practices`            |
| UI/UX, diseño de interfaces                 | `frontend-design`                        |
| Diseño de interfaces web                    | `ui-ux-pro-max`                          |

---

## Engram Persistence (Obligatorio)

**Guardar SIEMPRE después de:**

- Decisiones de arquitectura o diseño
- Bugs corregidos (con root cause)
- Patrones establecidos
- Descubrimientos no obvios sobre el codebase
- Campos del backend que NO existen (evitar errores futuros)

**Formato:**

```
title: "Breve descripción"
type: bugfix | decision | architecture | discovery | pattern
content:
  What: Qué se hizo
  Why: Por qué se tomó esa decisión
  Where: Archivos afectados
  Learned: Gotchas o edge cases
```

---

## Comandos Disponibles

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Iniciar dev server en localhost:5173 |
| `npm run build` | Build para producción                |
| `npm run lint`  | ESLint check                         |

---

## Notas Importantes

- **NO ejecutar build** después de cambios — el usuario lo hace
- **Backend fields**: Verificar campos reales del backend antes de usar
- **Filtrado**: Backend ahora SÍ devuelve `matricula` (FK numérico) en asistencias — usar `a.matricula === enrollment.id` para filtrar. Nunca usar `taller_nombre` porque mezcla matrículas del mismo taller.
- **estado_calculado**: El portal recibe `estado_calculado` ('activa' | 'no_procesado') en cada matrícula. Usarlo para detectar matrículas sin recibo.
- **Pagos**: `paquetes` es array de strings. Para filtrar por matrícula exacta usar `matricula_ids` (array de números, vía ReciboMatricula).
- **Ciclo change**: Siempre navegar a `/` después de cambiar ciclo
- **localStorage**: Siempre wrap en try-catch (falla en private mode)
- **Onboarding**: `WelcomeModal` (primera visita, `portal_welcome_dismissed`) + `TourOverlay` (spotlight tooltips, `portal_tutorial_completed`). Ambos usan localStorage. El botón "?" en el Header abre `HelpModal` contextual.
- **Componentes help**: `WelcomeModal`, `TourOverlay`, `HelpModal` en `src/components/help/`.

---

_Ultima actualización: Mayo 2026_
