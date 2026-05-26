import React from 'react';
import Map from 'react-map-gl/maplibre';
import { Source, Layer } from 'react-map-gl';
import { MAP_CONFIG } from '../../config/maps/wms-sources';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers } from 'lucide-react';

interface MapViewerV2Props {
  elementos: any[];
  seleccionado: any;
  alSeleccionar: (el: any) => void;
}

export default function MapViewerV2({ elementos, seleccionado, alSeleccionar }: MapViewerV2Props) {
  return (
    <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col min-h-[450px] relative overflow-hidden">
      {/* Encabezado del Plano */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-200">Visor GIS Interactivo (MapLibre GL)</h2>
        </div>
      </div>

      {/* Contenedor del Mapa MapLibre */}
      <div className="flex-1 w-full relative flex items-center justify-center bg-[#07090e] rounded-2xl border border-slate-800/60 overflow-hidden min-h-[380px]">
        <div style={{ width: '100%', height: '100%', absolute: 'absolute', inset: 0 }}>
          <Map
            initialViewState={{
              longitude: MAP_CONFIG.defaultCenter[0],
              latitude: MAP_CONFIG.defaultCenter[1],
              zoom: MAP_CONFIG.defaultZoom
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={{
              version: 8,
              sources: {},
              layers: []
            }}
          >
            <Source id="osm" type="raster" {...MAP_CONFIG.layers.osm}>
              <Layer id="osm-layer" type="raster" source="osm" />
            </Source>
          </Map>
        </div>
      </div>
    </div>
  );
}
