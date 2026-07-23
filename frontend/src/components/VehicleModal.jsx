import React, { useState, useEffect } from 'react';
import { X, Car, Plus, Save } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

export default function VehicleModal({ isOpen, onClose, editingVehicle }) {
  const { createVehicle, updateVehicle } = useVehicles();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'Sports',
    price: '',
    quantity: 1,
    image_url: '',
    description: ''
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        make: editingVehicle.make || '',
        model: editingVehicle.model || '',
        year: editingVehicle.year || 2024,
        category: editingVehicle.category || 'Sports',
        price: editingVehicle.price || '',
        quantity: editingVehicle.quantity || 1,
        image_url: editingVehicle.image_url || '',
        description: editingVehicle.description || ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        year: 2024,
        category: 'Sports',
        price: '',
        quantity: 1,
        image_url: '',
        description: ''
      });
    }
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) return;

    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, formData);
    } else {
      await createVehicle(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl relative border border-slate-700 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
          <Car className="w-6 h-6 text-amber-400" />
          <span>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {editingVehicle ? 'Update model specifications and pricing' : 'Enter new inventory specifications'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={e => setFormData({ ...formData, make: e.target.value })}
                placeholder="Porsche, Tesla, BMW..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                placeholder="911 GT3, Model S..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Luxury">Luxury</option>
                <option value="Truck">Truck</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price (USD) *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="e.g. 150000"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key specifications, engine layout..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {editingVehicle ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editingVehicle ? 'Save Vehicle Changes' : 'Publish Vehicle'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
