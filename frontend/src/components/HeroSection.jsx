import React from 'react';
import { DollarSign, Car, AlertTriangle, Layers } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

export default function HeroSection() {
  const { vehicles } = useVehicles();

  const totalValue = vehicles.reduce((sum, v) => sum + (parseFloat(v.price) * v.quantity), 0);
  const outOfStockCount = vehicles.filter(v => v.quantity === 0).length;
  const categoriesCount = new Set(vehicles.map(v => v.category)).size;

  return (
    <section className="relative overflow-hidden pt-8 pb-6 border-b border-slate-800/80">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Full-Stack TDD Kata Demonstration
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Curated Executive & Sport <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300">Inventory</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Seamless real-time inventory tracking, search filtering, JWT authenticated purchasing, and admin restocking.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Total Fleet Value</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <span className="text-[10px] text-emerald-400 font-medium">Real-time valuation</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Available Vehicles</span>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {vehicles.reduce((acc, v) => acc + v.quantity, 0)} Units
            </p>
            <span className="text-[10px] text-indigo-400 font-medium">{vehicles.length} unique models</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Categories</span>
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {categoriesCount} Types
            </p>
            <span className="text-[10px] text-violet-400 font-medium">Sports, Electric, SUV, Sedan</span>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Out of Stock</span>
              <div className={`p-1.5 rounded-lg ${outOfStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {outOfStockCount} Models
            </p>
            <span className="text-[10px] text-amber-400 font-medium">Requires Restock</span>
          </div>

        </div>

      </div>
    </section>
  );
}
