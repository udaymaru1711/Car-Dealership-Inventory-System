import React from 'react';
import { ShoppingCart, Edit3, Trash2, PlusCircle, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

export default function VehicleCard({ vehicle, onEdit, onRestock }) {
  const { isAdmin } = useAuth();
  const { purchaseVehicle, deleteVehicle } = useVehicles();

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000'}
          alt={`${vehicle.make} ${vehicle.model}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
          {vehicle.category}
        </span>

        {/* Quantity Status Badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold flex items-center gap-1 border ${
            isOutOfStock
              ? 'bg-rose-950/80 text-rose-400 border-rose-800/50'
              : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
          }`}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle className="w-3 h-3" />
              <span>Out of Stock</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3" />
              <span>{vehicle.quantity} In Stock</span>
            </>
          )}
        </span>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{vehicle.year}</span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {vehicle.description || 'High-performance engineering with luxury refined interior.'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">MSRP Price</span>
              <span className="text-xl font-extrabold text-white">
                ${parseFloat(vehicle.price).toLocaleString()}
              </span>
            </div>
          </div>

          {/* User Purchase Button */}
          <button
            onClick={() => purchaseVehicle(vehicle.id)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}</span>
          </button>

          {/* Admin Management Bar */}
          {isAdmin && (
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Restock</span>
              </button>

              <button
                onClick={() => onEdit(vehicle)}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                title="Edit Vehicle"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteVehicle(vehicle.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Delete Vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
