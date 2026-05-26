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
  // ... más flags
};

// src/hooks/useFeatureFlag.ts
export const useFeatureFlag = (flagName: string): boolean => {
  const flag = FEATURES[flagName];
  if (!flag) return false;
  
  // Override por query param en desarrollo
  if (process.env.NODE_ENV === 'development') {
    const params = new URLSearchParams(window.location.search);
    if (params.has('flags')) {
      const enabled = params.get('flags')?.split(',').includes(flagName);
      if (enabled !== undefined) return enabled;
    }
  }
  
  return flag.environments[process.env.NODE_ENV as keyof typeof flag.environments] ?? flag.default;
};