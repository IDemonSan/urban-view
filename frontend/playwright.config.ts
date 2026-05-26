import { defineConfig, devices } from '@playwright/test';

/**
 * Ver especificaciones detalladas en: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Reintentar tests fallidos */
  retries: 2,
  /* Usar el 50% de los cores disponibles de CPU */
  workers: '50%',
  /* Reporte detallado de pruebas */
  reporter: 'html',
  /* Configuración del navegador */
  use: {
    /* Puerto del servidor web local */
    baseURL: 'http://localhost',
    /* Captura de pantalla si una prueba falla */
    screenshot: 'only-on-failure',
    /* Grabar traza de ejecución si falla */
    trace: 'retain-on-failure',
  },

  /* Proyectos para navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
