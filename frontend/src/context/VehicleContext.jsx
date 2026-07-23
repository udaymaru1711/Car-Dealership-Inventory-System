import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_VEHICLES,
  fetchVehicles,
  purchaseVehicleApi,
  restockVehicleApi,
  createVehicleApi,
  updateVehicleApi,
  deleteVehicleApi
} from '../services/api';
import { useAuth } from './AuthContext';

const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    maxPrice: 300000,
    inStockOnly: false
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVehicles(token, filters);
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const purchaseVehicle = async (id) => {
    const target = vehicles.find(v => v.id === id);
    if (!target || target.quantity <= 0) {
      showToast('Vehicle is out of stock!', 'error');
      return;
    }

    try {
      await purchaseVehicleApi(id, token);
      setVehicles(prev =>
        prev.map(v => (v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v))
      );
      showToast(`Successfully purchased ${target.make} ${target.model}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const restockVehicle = async (id, quantity) => {
    const target = vehicles.find(v => v.id === id);
    try {
      await restockVehicleApi(id, quantity, token);
      setVehicles(prev =>
        prev.map(v => (v.id === id ? { ...v, quantity: v.quantity + parseInt(quantity) } : v))
      );
      showToast(`Restocked ${quantity} unit(s) for ${target ? target.model : 'Vehicle'}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const createVehicle = async (vehicleData) => {
    try {
      const res = await createVehicleApi(vehicleData, token);
      const newV = res.vehicle || { id: Date.now(), ...vehicleData };
      setVehicles(prev => [newV, ...prev]);
      showToast(`Added ${newV.make} ${newV.model} to inventory!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    try {
      const res = await updateVehicleApi(id, vehicleData, token);
      const updatedV = res.vehicle || { id, ...vehicleData };
      setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updatedV } : v)));
      showToast(`Updated ${updatedV.make} ${updatedV.model} details!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const deleteVehicle = async (id) => {
    const target = vehicles.find(v => v.id === id);
    try {
      await deleteVehicleApi(id, token);
      setVehicles(prev => prev.filter(v => v.id !== id));
      showToast(`Deleted ${target ? target.model : 'vehicle'} from inventory.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        filters,
        setFilters,
        toast,
        purchaseVehicle,
        restockVehicle,
        createVehicle,
        updateVehicle,
        deleteVehicle,
        refreshVehicles: loadVehicles
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  return useContext(VehicleContext);
}
