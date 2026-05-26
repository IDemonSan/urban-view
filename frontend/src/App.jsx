import React, { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import Map from './components/Map';
import MapViewerV2 from './components/map/MapViewerV2';
import Sidebar from './components/Sidebar';
import { LayoutDashboard, Database, HelpCircle, RefreshCw, Layers, ShieldCheck, MapPin } from 'lucide-react';
import ThemeToggle from './components/ui/ThemeToggle';
import { useFeatureFlag } from './hooks/useFeatureFlag';

// Obtiene dinámicamente la URL de la API según el entorno de ejecución
const getApiUrl = () => {
  // En entorno local de Vite (puerto 5173), consulta directamente al backend en el puerto 8080
  if (window.location.port === '5173') {
    return 'http://localhost:8080/api/plano';
  }
  // Si accedemos a la web directamente en los puertos físicos 8081 u 8082 sin pasar por el puerto 80,
  // redirigimos las peticiones de API al puerto 80 donde corre nuestro Proxy Inverso global.
  if (window.location.port === '8081' || window.location.port === '8082') {
    return `http://${window.location.hostname}/api/plano`;
  }
  // En producción normal (detrás del reverse proxy de Nginx en puerto 80), se sirve desde la misma ruta relativa
  return '/api/plano';
};

export default function App() {
  const [elementos, setElementos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [operacionCargando, setOperacionCargando] = useState(false);

  const API_URL = getApiUrl();

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    try {
      console.log(`[FRONTEND] Solicitando datos a: ${API_URL}`);
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status} ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      
      // Ordenar para garantizar que los Lotes se dibujen encima de Calles y Parques en el SVG
      const ordenados = [...datos].sort((a, b) => {
        const order = { 'CALLE': 1, 'PARQUE': 2, 'LOTE': 3 };
        return (order[a.tipoElemento] || 99) - (order[b.tipoElemento] || 99);
      });

      setElementos(ordenados);
      
      // Actualizar la selección actual si corresponde
      if (seleccionado) {
        const actualizado = ordenados.find(el => el.id === seleccionado.id);
        if (actualizado) setSeleccionado(actualizado);
      }
    } catch (err) {
      console.error('[FRONTEND] Error en fetch:', err);
      setError('No se pudo conectar con el servidor API. Por favor, verifique que el backend esté levantado.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarEstadoLote = async (id, nuevoEstado) => {
    setOperacionCargando(true);
    try {
      const URL = `${API_URL}/${id}/estado`;
      console.log(`[FRONTEND] Modificando estado en: ${URL}`);
      const respuesta = await fetch(URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!respuesta.ok) {
        const errMessage = await respuesta.text();
        throw new Error(errMessage || 'Error al actualizar el estado comercial.');
      }

      console.log(`[FRONTEND] Lote actualizado exitosamente a: ${nuevoEstado}`);
      // Recargar todos los elementos para mantener sincronía total con PostGIS
      await cargarDatos();
    } catch (err) {
      alert(`Error en comercialización: ${err.message}`);
    } finally {
      setOperacionCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* 1. Header / Navbar de Alto Impacto */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 mb-6 border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand/Logotipo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white">
              <Layers className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                UrbanView <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider font-semibold">v1.0 MVP</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Plataforma PropTech Geoespacial</p>
            </div>
          </div>

          {/* Estado de Infraestructura & Conectores */}
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={cargarDatos}
              disabled={cargando}
              className="px-3.5 py-1.5 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 ${cargando ? 'animate-spin' : ''}`} />
              Sincronizar PostGIS
            </button>
            <div className="px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2 text-[10px] font-semibold tracking-wide uppercase text-slate-400">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              PostGIS:
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span className="text-emerald-400 font-bold lowercase">online</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Área del Dashboard Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 mb-8 flex flex-col">
        {/* Estadísticas de Venta */}
        {!cargando && elementos.length > 0 && <DashboardStats elementos={elementos} />}

        {/* Carga Principal y Manejo de Errores */}
        {cargando && elementos.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin mb-4"></div>
            <p className="font-semibold text-slate-300">Estableciendo conexión geoespacial...</p>
            <p className="text-xs text-slate-500 mt-2">Cargando elementos urbanos directamente desde PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl p-12 flex-1 flex flex-col justify-center items-center text-center border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.05)]">
            <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full mb-4 border border-rose-500/20">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Error de Conexión de Datos</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md">{error}</p>
            <button 
              onClick={cargarDatos}
              className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar Conexión
            </button>
          </div>
        ) : (
          /* Visualizador de Plano e Información */
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Visualizador de Plano SVG o MapLibre GL */}
            {useFeatureFlag('enable-maplibre-viewer') ? (
              <MapViewerV2
                elementos={elementos}
                seleccionado={seleccionado}
                alSeleccionar={setSeleccionado}
              />
            ) : (
              <Map 
                elementos={elementos}
                seleccionado={seleccionado}
                alSeleccionar={setSeleccionado}
              />
            )}

            {/* Sidebar de Operaciones y Simulador */}
            <Sidebar 
              seleccionado={seleccionado}
              alCambiarEstado={cambiarEstadoLote}
              cargando={operacionCargando}
            />
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="glass-panel py-4 px-6 mt-auto border-t border-white/5 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p>© 2026 UrbanView S.A. Todos los derechos reservados. Desarrollado en Arquitectura Microservicios Containerizada.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-indigo-400" /> Docker Security TLS</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-emerald-400" /> EPSG:4326</span>
        </div>
      </footer>

    </div>
  );
}
