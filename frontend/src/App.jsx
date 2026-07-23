import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VehicleProvider, useVehicles } from './context/VehicleContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import VehicleCard from './components/VehicleCard';
import AuthModal from './components/AuthModal';
import VehicleModal from './components/VehicleModal';
import RestockModal from './components/RestockModal';
import { Sparkles, Car, ShieldCheck } from 'lucide-react';

function Toast() {
  const { toast } = useVehicles();
  if (!toast) return null;

  const bg =
    toast.type === 'error'
      ? 'bg-rose-500/90 text-white border-rose-400'
      : toast.type === 'info'
      ? 'bg-sky-500/90 text-white border-sky-400'
      : 'bg-emerald-500/90 text-white border-emerald-400';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md font-medium text-sm flex items-center gap-3 ${bg}`}>
        <Sparkles className="w-5 h-5" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function MainContent() {
  const { vehicles, loading } = useVehicles();
  const { isAdmin } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [vehicleModal, setVehicleModal] = useState({ open: false, mode: 'create', vehicle: null });
  const [restockModal, setRestockModal] = useState({ open: false, vehicle: null });

  const handleOpenAddVehicle = () => {
    setVehicleModal({ open: true, mode: 'create', vehicle: null });
  };

  const handleOpenEditVehicle = (v) => {
    setVehicleModal({ open: true, mode: 'edit', vehicle: v });
  };

  const handleOpenRestock = (v) => {
    setRestockModal({ open: true, vehicle: v });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
      <HeroSection onAddVehicle={handleOpenAddVehicle} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <FilterBar />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">Loading AutoVault Inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl p-8 max-w-md mx-auto">
            <Car className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">No Vehicles Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              No matching luxury vehicles fit your current filter parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onEdit={handleOpenEditVehicle}
                onRestock={handleOpenRestock}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>AutoVault Car Dealership Inventory System © 2026</span>
          </div>
          <p>Powered by Express + PostgreSQL + React + Vite + Tailwind CSS</p>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <VehicleModal
        isOpen={vehicleModal.open}
        mode={vehicleModal.mode}
        vehicle={vehicleModal.vehicle}
        onClose={() => setVehicleModal({ open: false, mode: 'create', vehicle: null })}
      />
      <RestockModal
        isOpen={restockModal.open}
        vehicle={restockModal.vehicle}
        onClose={() => setRestockModal({ open: false, vehicle: null })}
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <MainContent />
      </VehicleProvider>
    </AuthProvider>
  );
}
