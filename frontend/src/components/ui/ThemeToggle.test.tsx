import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../../contexts/ThemeContext';

// Helper de renderizado rápido inyectando un contexto Mock de temas
const renderWithTheme = (theme: 'light' | 'dark', toggleTheme: () => void, legacyMode: boolean = false) => {
  return render(
    <ThemeContext.Provider value={{ theme, toggleTheme, legacyMode }}>
      <ThemeToggle />
    </ThemeContext.Provider>
  );
};

describe('ThemeToggle Component - A11y & Feature Flag Tests', () => {
  
  it('no debe renderizar nada si legacyMode es activo (Feature Flag OFF)', () => {
    const toggleThemeMock = jest.fn();
    const { container } = renderWithTheme('dark', toggleThemeMock, true);
    
    // Verificamos que el DOM esté completamente vacío
    expect(container.firstChild).toBeNull();
  });

  it('debe renderizar el botón y alternar el tema al hacer click', () => {
    const toggleThemeMock = jest.fn();
    renderWithTheme('dark', toggleThemeMock, false);

    // Buscar botón por rol y aria-label
    const button = screen.getByRole('button', { name: /cambiar a modo claro/i });
    expect(button).toBeInTheDocument();

    // Simular el evento click
    fireEvent.click(button);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('debe tener los atributos de accesibilidad WCAG correctos en modo claro', () => {
    const toggleThemeMock = jest.fn();
    renderWithTheme('light', toggleThemeMock, false);

    const button = screen.getByRole('button', { name: /cambiar a modo oscuro/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
    expect(button).toHaveAttribute('title', 'Cambiar a modo oscuro');
  });

  it('debe responder a eventos de teclado Enter y Espacio (WCAG 2.2 keyboard navigation)', () => {
    const toggleThemeMock = jest.fn();
    renderWithTheme('dark', toggleThemeMock, false);

    const button = screen.getByRole('button', { name: /cambiar a modo claro/i });

    // Simular presionar la tecla Enter
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);

    // Simular presionar la tecla Espacio
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(toggleThemeMock).toHaveBeenCalledTimes(2);
  });
});
