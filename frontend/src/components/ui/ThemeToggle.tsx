import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, legacyMode } = useTheme();

  // Si la feature flag está desactivada, no renderizar nada (Zero-breaking)
  if (legacyMode) return null;

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleTheme();
        }
      }}
      className="p-2.5 rounded-xl border border-border-color bg-bg-card hover:bg-indigo-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all duration-300 text-text-primary"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-500 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
};
export default ThemeToggle;
