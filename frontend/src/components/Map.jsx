import React from 'react';
import { Layers, HelpCircle, Navigation } from 'lucide-react';

// Coordenadas predefinidas para ubicar las etiquetas de texto de forma precisa en el plano SVG
const LABEL_COORDINATES = {
  'Mz A - Lote 1': { x: 850, y: 165 },
  'Mz A - Lote 2': { x: 850, y: 285 },
  'Mz A - Lote 3': { x: 850, y: 405 },
  'Mz B - Lote 1': { x: 390, y: 465 },
  'Mz B - Lote 2': { x: 610, y: 465 },
  'Avenida Principal': { x: 500, y: 73 },
  'Calle Secundaria': { x: 120, y: 320, rotate: -90 },
  'Parque Central': { x: 500, y: 285 }
};

export default function Map({ elementos, seleccionado, alSeleccionar }) {

  const obtenerEstilosElemento = (el) => {
    const esSeleccionado = seleccionado && seleccionado.id === el.id;

    if (el.tipoElemento === 'LOTE') {
      if (el.estado === 'VENDIDO') {
        return {
          className: `transition-all duration-300 cursor-pointer stroke-[2] ${
            esSeleccionado 
              ? 'fill-rose-500/40 stroke-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] pulse-glow-red' 
              : 'fill-rose-500/15 stroke-rose-500/70 hover:fill-rose-500/30 hover:stroke-rose-400'
          }`,
        };
      } else {
        return {
          className: `transition-all duration-300 cursor-pointer stroke-[2] ${
            esSeleccionado 
              ? 'fill-emerald-500/40 stroke-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)] pulse-glow-green' 
              : 'fill-emerald-500/15 stroke-emerald-500/70 hover:fill-emerald-500/30 hover:stroke-emerald-400'
          }`,
        };
      }
    } else if (el.tipoElemento === 'CALLE') {
      return {
        className: 'fill-slate-800/30 stroke-slate-700/40 stroke-[2] stroke-dasharray-[6,6]',
      };
    } else if (el.tipoElemento === 'PARQUE') {
      return {
        className: 'fill-emerald-950/20 stroke-emerald-800/40 stroke-[2]',
      };
    }
    return {};
  };

  return (
    <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col min-h-[450px] relative overflow-hidden">
      {/* Encabezado del Plano */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-200">Plano General del Desarrollo</h2>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/80 inline-block"></span>
            <span className="text-slate-300">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500/80 inline-block"></span>
            <span className="text-slate-300">Vendido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-800/30 border border-slate-700/60 inline-block"></span>
            <span className="text-slate-300">Infraestructura</span>
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa SVG */}
      <div className="flex-1 w-full relative flex items-center justify-center bg-[#07090e] rounded-2xl border border-slate-800/60 overflow-hidden svg-grid-pattern min-h-[380px]">
        
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full max-h-[500px] object-contain select-none"
        >
          {/* Renderizado de Polígonos de Fondo / Elementos del Plano */}
          {elementos.map((el) => {
            const estilos = obtenerEstilosElemento(el);
            return (
              <g key={el.id} onClick={() => el.tipoElemento === 'LOTE' && alSeleccionar(el)}>
                <path
                  d={el.svgPath}
                  {...estilos}
                />
              </g>
            );
          })}

          {/* Renderizado de Etiquetas de Texto Inteligentes */}
          {elementos.map((el) => {
            const coords = LABEL_COORDINATES[el.codigo];
            if (!coords) return null;

            const esLote = el.tipoElemento === 'LOTE';
            const esSeleccionado = seleccionado && seleccionado.id === el.id;

            return (
              <text
                key={`label-${el.id}`}
                x={coords.x}
                y={coords.y}
                textAnchor="middle"
                transform={coords.rotate ? `rotate(${coords.rotate}, ${coords.x}, ${coords.y})` : ''}
                className={`font-sans tracking-wide pointer-events-none select-none ${
                  esLote 
                    ? `text-[11px] font-bold transition-all duration-300 ${
                        esSeleccionado 
                          ? 'fill-white scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                          : el.estado === 'VENDIDO' ? 'fill-rose-300/80' : 'fill-emerald-300/80'
                      }`
                    : el.tipoElemento === 'PARQUE'
                      ? 'text-xs font-semibold fill-emerald-300/60 tracking-widest uppercase'
                      : 'text-[10px] font-medium fill-slate-400/50 tracking-widest uppercase'
                }`}
              >
                {el.codigo}
              </text>
            );
          })}
        </svg>

        {/* Brújula de orientación geoespacial en esquina */}
        <div className="absolute bottom-4 right-4 p-2 bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-xl text-slate-400 flex items-center gap-1.5 pointer-events-none text-[10px] tracking-wider uppercase">
          <Navigation className="h-3 w-3 text-indigo-400 rotate-45" />
          Norte Geoespacial (SRID 4326)
        </div>
      </div>
    </div>
  );
}
