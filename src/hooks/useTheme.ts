import { useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Obtener tema actual del DOM (más confiable que el estado de React)
  const getCurrentTheme = useCallback((): Theme => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getCurrentTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }, [getCurrentTheme, setTheme]);

  const resolvedTheme = getCurrentTheme();

  return {
    theme: resolvedTheme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
