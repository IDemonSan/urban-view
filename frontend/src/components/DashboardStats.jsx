import React from 'react';
import { Home, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardStats({ elementos }) {
  const lotes = elementos.filter(el => el.tipoElemento === 'LOTE');
  const totalLotes = lotes.length;
  const disponibles = lotes.filter(el => el.estado === 'DISPONIBLE').length;
  const vendidos = lotes.filter(el => el.estado === 'VENDIDO').length;
  
  // Porcentaje vendido
  const porcentajeVendido = totalLotes > 0 ? Math.round((vendidos / totalLotes) * 100) : 0;
  
  // Estimación de ingresos totales (digamos $50,000 por lote vendido)
  const ingresosEstimados = vendidos * 45000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {/* Tarjeta 1: Total Lotes */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:scale-[1.02]">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Lotes</p>
          <h3 className="text-3xl font-bold font-sans mt-1 text-slate-100">{totalLotes}</h3>
          <p className="text-[10px] text-slate-400 mt-2">Registrados en PostGIS</p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <Home className="h-6 w-6" />
        </div>
      </div>

      {/* Tarjeta 2: Disponibles */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-emerald-500/30 hover:scale-[1.02]">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponibles</p>
          <h3 className="text-3xl font-bold font-sans mt-1 text-emerald-400">{disponibles}</h3>
          <p className="text-[10px] text-emerald-500/70 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Listos para comercializar
          </p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      </div>

      {/* Tarjeta 3: Vendidos / Avance */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-rose-500/30 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lotes Vendidos</p>
            <h3 className="text-3xl font-bold font-sans mt-1 text-rose-400">{vendidos}</h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span>Progreso del Proyecto</span>
            <span className="font-semibold text-rose-400">{porcentajeVendido}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-rose-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${porcentajeVendido}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tarjeta 4: Valor Comercial */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-amber-500/30 hover:scale-[1.02]">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Estimadas</p>
          <h3 className="text-3xl font-bold font-sans mt-1 text-amber-400">
            ${ingresosEstimados.toLocaleString('es-MX')}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Basado en promedio del sector</p>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
          <DollarSign className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
