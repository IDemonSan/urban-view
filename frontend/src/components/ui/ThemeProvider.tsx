import React, { useState, useEffect } from 'react';
import { Theme, ThemeContext } from '../../contexts/ThemeContext';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Validar si el Feature Flag del nuevo sistema de temas está activo
  const isFeatureEnabled = useFeatureFlag('enable-new-theme');

  const [theme, setTheme] = useState<Theme>(() => {
    // Si la feature flag está inactiva (Default OFF para prod), forzar tema oscuro legado
    if (!isFeatureEnabled) return 'dark';

    const saved = localStorage.getItem('theme') as Theme;
    if (saved === 'light' || saved === 'dark') return saved;

    // Detectar preferencia del sistema operativo
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Si la feature flag está inactiva, mantener siempre clase dark en el HTML (estética legado)
    if (!isFeatureEnabled) {
      root.classList.add('dark');
      return;
    }

    // Aplicar clase correspondiente para Tailwind
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme, isFeatureEnabled]);

  const toggleTheme = () => {
    if (!isFeatureEnabled) return;
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, legacyMode: !isFeatureEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
