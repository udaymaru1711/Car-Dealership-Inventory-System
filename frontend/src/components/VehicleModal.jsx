import React, { useState, useEffect } from 'react';
import { X, Car, Plus, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const PRESET_IMAGES = [
  { label: 'Porsche 911', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Tesla S', url: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Audi RS6', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000' },
  { label: 'Lamborghini', url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1000' },
];

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Vehicle Image</label>
              <label className="text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload Local File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <input
              type="text"
              value={formData.image_url}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Paste image web URL or select local file / preset below..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none mb-2"
            />

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Presets:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: preset.url })}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[10px] text-slate-300 font-medium transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
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
