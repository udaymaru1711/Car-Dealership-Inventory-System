const API_BASE_URL = '/api';

// Initial fallback dataset for instant rich visual demo
export const INITIAL_VEHICLES = [
  {
    id: 1,
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports',
    price: 241300,
    quantity: 3,
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000',
    description: '4.0L Naturally Aspirated Flat-6 producing 518 HP with active aerodynamics.'
  },
  {
    id: 2,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    price: 89990,
    quantity: 5,
    image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
    description: 'Tri-Motor All-Wheel Drive delivering 1,020 HP and 0-60 mph in 1.99s.'
  },
  {
    id: 3,
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2024,
    category: 'SUV',
    price: 179000,
    quantity: 2,
    image_url: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&q=80&w=1000',
    description: 'Handcrafted AMG 4.0L V8 Biturbo with iconic luxury off-road capability.'
  },
  {
    id: 4,
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Electric',
    price: 147100,
    quantity: 0,
    image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000',
    description: '637 HP Dual-synchronous electric motors with quattro all-wheel drive.'
  },
  {
    id: 5,
    make: 'BMW',
    model: 'M5 Competition',
    year: 2024,
    category: 'Sedan',
    price: 109900,
    quantity: 4,
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000',
    description: '4.4-liter M TwinPower Turbo V8 engine generating 617 HP.'
  },
  {
    id: 6,
    make: 'Ferrari',
    model: 'F8 Tributo',
    year: 2023,
    category: 'Sports',
    price: 280000,
    quantity: 1,
    image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000',
    description: 'Mid-rear 3.9L Twin-Turbo V8 pushing 710 HP to the rear wheels.'
  }
];

export async function fetchVehicles(token, filters = {}) {
  try {
    let url = `${API_BASE_URL}/vehicles`;
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append('make', filters.search);
    if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

    if ([...queryParams].length > 0) {
      url = `${API_BASE_URL}/vehicles/search?${queryParams.toString()}`;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('API Request Failed');
    const data = await response.json();
    return data.vehicles || [];
  } catch (err) {
    // Fallback search logic
    let results = [...INITIAL_VEHICLES];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(v => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q));
    }
    if (filters.category && filters.category !== 'All') {
      results = results.filter(v => v.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.maxPrice) {
      results = results.filter(v => v.price <= parseFloat(filters.maxPrice));
    }
    if (filters.inStockOnly) {
      results = results.filter(v => v.quantity > 0);
    }
    return results;
  }
}

export async function purchaseVehicleApi(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: 1 })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Purchase failed');
    }
    return await response.json();
  } catch (err) {
    return { success: true, message: 'Vehicle purchased successfully (Demo)' };
  }
}

export async function restockVehicleApi(id, quantity, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Restock failed');
    }
    return await response.json();
  } catch (err) {
    return { success: true, message: 'Vehicle restocked successfully (Demo)' };
  }
}

export async function createVehicleApi(vehicleData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create vehicle');
    }
    return await response.json();
  } catch (err) {
    return { success: true, vehicle: { id: Date.now(), ...vehicleData } };
  }
}

export async function updateVehicleApi(id, vehicleData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(vehicleData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update vehicle');
    }
    return await response.json();
  } catch (err) {
    return { success: true, vehicle: { id, ...vehicleData } };
  }
}

export async function deleteVehicleApi(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete vehicle');
    }
    return await response.json();
  } catch (err) {
    return { success: true, deletedVehicleId: id };
  }
}
