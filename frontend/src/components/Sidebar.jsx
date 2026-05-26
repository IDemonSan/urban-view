import React, { useState, useEffect } from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, DollarSign, Calculator, Percent, Sparkles } from 'lucide-react';

export default function Sidebar({ seleccionado, alCambiarEstado, cargando }) {
  // Parámetros de cotización ficticios basados en el lote seleccionado
  const [enganchePorcentaje, setEnganchePorcentaje] = useState(30);
  const [plazoMeses, setPlazoMeses] = useState(12);

  if (!seleccionado) {
    return (
      <div className="glass-panel w-full lg:w-96 rounded-3xl p-6 flex flex-col justify-center items-center text-center text-slate-400 min-h-[350px]">
        <div className="p-4 bg-slate-900/40 rounded-full mb-4 border border-slate-800">
          <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>
        <p className="font-semibold text-slate-200">Seleccione un lote del plano</p>
        <p className="text-xs text-slate-400 mt-2 max-w-[240px]">
          Haga clic en cualquiera de los lotes interactivos para visualizar su información comercial, ficha técnica y simulación financiera en tiempo real.
        </p>
      </div>
    );
  }

  // Ficha técnica estimada
  const areaEstimada = seleccionado.codigo.includes('Lote 1') ? 180 : seleccionado.codigo.includes('Lote 2') ? 220 : 200;
  const precioM2 = 250; // $250 USD por m2
  const valorTotal = areaEstimada * precioM2;

  // Cálculos financieros
  const engancheMinimo = (valorTotal * enganchePorcentaje) / 100;
  const saldoFinanciar = valorTotal - engancheMinimo;
  const cuotaMensual = saldoFinanciar / plazoMeses;

  return (
    <div className="glass-panel w-full lg:w-96 rounded-3xl p-6 flex flex-col gap-6 justify-between border-indigo-500/10">
      
      {/* 1. Detalle Comercial del Lote */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {seleccionado.tipoElemento}
            </span>
            <h2 className="text-2xl font-black text-slate-100 mt-1">{seleccionado.codigo}</h2>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            seleccionado.estado === 'DISPONIBLE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {seleccionado.estado}
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">UUID del Recurso</span>
            <span className="font-mono text-[10px] text-indigo-300 truncate max-w-[160px]" title={seleccionado.id}>
              {seleccionado.id}
            </span>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-900 pt-2.5">
            <span className="text-slate-400">Área estimada</span>
            <span className="font-semibold text-slate-200">{areaEstimada} m²</span>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-900 pt-2.5">
            <span className="text-slate-400">Precio de lista</span>
            <span className="font-semibold text-indigo-400">${valorTotal.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      {/* 2. Control de Estado Rápido (Junto a regla de negocio) */}
      <div className="bg-slate-900/30 border border-indigo-500/5 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            Acciones de Comercialización
          </span>
        </div>
        
        <button
          onClick={() => alCambiarEstado(
            seleccionado.id, 
            seleccionado.estado === 'DISPONIBLE' ? 'VENDIDO' : 'DISPONIBLE'
          )}
          disabled={cargando}
          className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all duration-300 ${
            seleccionado.estado === 'DISPONIBLE'
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 active:scale-95'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 active:scale-95'
          } disabled:opacity-50`}
        >
          {seleccionado.estado === 'DISPONIBLE' ? (
            <>
              <ToggleRight className="h-5 w-5" />
              Marcar como VENDIDO
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5" />
              Marcar como DISPONIBLE
            </>
          )}
        </button>
      </div>

      {/* 3. Cotizador Financiero Dinámico (Valor Premium) */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-4">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Calculator className="h-4 w-4 text-amber-400" />
          Simulador de Inversión Ficticia
        </h4>

        {/* Input Enganche */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Enganche ({enganchePorcentaje}%)</span>
            <span className="font-semibold text-slate-200">${engancheMinimo.toLocaleString()} USD</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="80" 
            step="5"
            value={enganchePorcentaje}
            onChange={(e) => setEnganchePorcentaje(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>

        {/* Input Plazo */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Plazo Financiamiento</span>
            <span className="font-semibold text-slate-200">{plazoMeses} meses</span>
          </div>
          <input 
            type="range" 
            min="6" 
            max="60" 
            step="6"
            value={plazoMeses}
            onChange={(e) => setPlazoMeses(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>

        {/* Cálculo de Cuota */}
        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 flex justify-between items-center">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-400">Mensualidad Estimada</p>
            <p className="text-sm font-black text-indigo-300 mt-0.5">${Math.round(cuotaMensual).toLocaleString()} USD</p>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Percent className="h-4 w-4" />
          </div>
        </div>
      </div>

    </div>
  );
}
