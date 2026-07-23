import React from 'react';
import { Car, ShieldCheck, UserCheck, LogOut, PlusCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuthModal, onOpenAddModal }) {
  const { user, isAdmin, loginAsAdmin, loginAsUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Car className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">AutoVault</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                PRO API
              </span>
            </div>
            <p className="text-xs text-slate-400">Luxury Dealership Inventory</p>
          </div>
        </div>

        {/* Action Controls & Authentication */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Role Switchers */}
          <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={loginAsUser}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                user && !isAdmin ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo User
            </button>
            <button
              onClick={loginAsAdmin}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                isAdmin ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Admin
            </button>
          </div>

          {/* Add Vehicle Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-sm transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          )}

          {/* User Auth Profile Badge */}
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
