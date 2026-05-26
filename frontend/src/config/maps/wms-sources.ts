export const MAP_CONFIG = {
  defaultCenter: [-3.703790, 40.416775] as [number, number],
  defaultZoom: 12,
  layers: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  }
};
