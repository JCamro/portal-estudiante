// Date Helpers

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export function getDiaSemana(dia: number): string {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[dia] || '';
}

export function isToday(diaSemana: number): boolean {
  return diaSemana === new Date().getDay();
}
