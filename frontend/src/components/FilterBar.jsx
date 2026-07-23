import React from 'react';
import { Search, Filter, RefreshCw, CheckSquare, Square } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const CATEGORIES = ['All', 'Sports', 'Electric', 'SUV', 'Sedan', 'Luxury', 'Truck'];

export default function FilterBar() {
  const { filters, setFilters, refreshVehicles } = useVehicles();

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  return (
    <div className="glass-panel p-4 rounded-2xl mb-8 border border-slate-800">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search by Make or Model (e.g. Porsche, Tesla, M5)..."
            className="w-full bg-slate-900/90 border border-slate-700/70 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filters.category === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Secondary Controls: Price Filter & Refresh */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Max Price:</span>
            <span className="font-bold text-white">${filters.maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min="50000"
              max="350000"
              step="10000"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
              className="w-28 sm:w-36 accent-indigo-500"
            />
          </div>

          <button
            onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition cursor-pointer"
          >
            {filters.inStockOnly ? (
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>In-Stock Only</span>
          </button>
        </div>

        <button
          onClick={refreshVehicles}
          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition ml-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh API</span>
        </button>

      </div>

    </div>
  );
}
