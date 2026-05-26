// src/config/features.ts

export type FeatureFlag = {
  default: boolean;
  environments: {
    development: boolean;
    staging: boolean;
    production: boolean;
  };
  description: string;
  owner: string; // equipo responsable
};

export const FEATURES: Record<string, FeatureFlag> = {
  'enable-new-theme': {
    default: false,
    environments: { development: true, staging: true, production: false },
    description: 'Nuevo sistema de temas con dark mode',
    owner: 'frontend-team'
  },
  'enable-maplibre-viewer': {
    default: false,
    environments: { development: true, staging: true, production: false },
    description: 'Visor de mapas con MapLibre GL + WMS',
    owner: 'frontend-team'
  },
  'enable-security-hardening': {
    default: false,
    environments: { development: true, staging: true, production: false },
    description: 'Hardening de seguridad Spring Security + Docker',
    owner: 'backend-team'
  },
  'enable-postgis-optimizations': {
    default: false,
    environments: { development: true, staging: true, production: false },
    description: 'Optimización de consultas PostGIS y simplificación',
    owner: 'database-team'
  }
};

/**
 * Obtiene el entorno de ejecución actual de forma segura.
 */
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // Vite expone la variable import.meta.env.MODE
  const mode = (import.meta.env?.MODE || 'development') as string;
  if (mode === 'production') return 'production';
  if (mode === 'staging') return 'staging';
  return 'development';
};

/**
 * Hook/función para validar si un Feature Flag está activo.
 * Sostiene desactivación por defecto en producción, activación por query params en desarrollo
 * y lectura de variables de entorno para staging.
 */
export const useFeatureFlag = (flagName: string): boolean => {
  const flag = FEATURES[flagName];
  if (!flag) return false;

  const env = getEnvironment();

  // Override por query param en desarrollo (ej: ?flags=enable-new-theme,enable-maplibre-viewer)
  if (env === 'development') {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('flags')) {
        const enabled = params.get('flags')?.split(',').includes(flagName);
        if (enabled !== undefined) return enabled;
      }
    }
  }

  // De lo contrario, retorna la configuración del entorno correspondiente
  return flag.environments[env] ?? flag.default;
};
