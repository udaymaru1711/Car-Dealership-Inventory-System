import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

export default function RestockModal({ vehicle, isOpen, onClose }) {
  const { restockVehicle } = useVehicles();
  const [quantity, setQuantity] = useState(5);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity > 0) {
      await restockVehicle(vehicle.id, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-sm p-6 rounded-3xl relative border border-slate-700 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-amber-400" />
          <span>Restock Inventory</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Replenish stock quantity for <strong className="text-white">{vehicle.make} {vehicle.model}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Quantity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Confirm Restock
          </button>
        </form>

      </div>
    </div>
  );
}
