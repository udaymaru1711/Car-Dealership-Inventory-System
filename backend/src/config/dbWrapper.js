const pool = require('./db');

// In-memory fallback database for testing/offline scenarios
const memoryDb = {
  users: [],
  vehicles: [],
  purchases: [],
  userIdSeq: 1,
  vehicleIdSeq: 1,
  purchaseIdSeq: 1
};

let isPgAvailable = null;

async function checkPgConnection() {
  if (isPgAvailable !== null) return isPgAvailable;
  try {
    const client = await pool.connect();
    client.release();
    isPgAvailable = true;
    return true;
  } catch (err) {
    isPgAvailable = false;
    return false;
  }
}

function searchInMemoryVehicles(filters = {}) {
  return memoryDb.vehicles.filter(v => {
    if (filters.make && !v.make.toLowerCase().includes(filters.make.toLowerCase())) {
      return false;
    }
    if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    if (filters.category && v.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    if (filters.minPrice !== undefined && parseFloat(v.price) < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice !== undefined && parseFloat(v.price) > parseFloat(filters.maxPrice)) {
      return false;
    }
    return true;
  });
}

async function query(text, params = []) {
  const usePg = await checkPgConnection();
  if (usePg) {
    return pool.query(text, params);
  }

  // Fallback memory implementation matching SQL query semantics
  const sql = text.trim().toLowerCase();

  // User queries
  if (sql.includes('select * from users where email =')) {
    const email = (params[0] || '').toLowerCase().trim();
    const user = memoryDb.users.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [] };
  }

  if (sql.includes('select * from users where id =')) {
    const id = parseInt(params[0]);
    const user = memoryDb.users.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  if (sql.includes('insert into users')) {
    const name = params[0];
    const email = params[1].toLowerCase().trim();
    const password = params[2];
    const role = params[3] || 'user';
    const newUser = {
      id: memoryDb.userIdSeq++,
      name,
      email,
      password,
      role,
      created_at: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    return { rows: [{ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, created_at: newUser.created_at }] };
  }

  // GET Vehicle by ID
  if (sql.includes('select * from vehicles where id =')) {
    const id = parseInt(params[0]);
    const vehicle = memoryDb.vehicles.find(v => v.id === id);
    return { rows: vehicle ? [vehicle] : [] };
  }

  // GET All Vehicles (no WHERE clause)
  if (sql === 'select * from vehicles order by id desc' || sql === 'select * from vehicles') {
    return { rows: [...memoryDb.vehicles].sort((a, b) => b.id - a.id) };
  }

  // INSERT Vehicle
  if (sql.includes('insert into vehicles')) {
    const make = params[0];
    const model = params[1];
    const year = parseInt(params[2]);
    const category = params[3];
    const price = parseFloat(params[4]);
    const quantity = parseInt(params[5] !== undefined ? params[5] : 0);
    const image_url = params[6] || null;
    const description = params[7] || null;

    const newVehicle = {
      id: memoryDb.vehicleIdSeq++,
      make,
      model,
      year,
      category,
      price,
      quantity,
      image_url,
      description,
      created_at: new Date().toISOString()
    };
    memoryDb.vehicles.push(newVehicle);
    return { rows: [newVehicle] };
  }

  // UPDATE Vehicle (Quantity Increment/Decrement or General Edit)
  if (sql.includes('update vehicles')) {
    const targetId = parseInt(params[params.length - 1]);
    const index = memoryDb.vehicles.findIndex(v => v.id === targetId);
    if (index === -1) return { rows: [] };

    // Check if quantity decrement query
    if (sql.includes('quantity = quantity -')) {
      const dec = parseInt(params[0]) || 1;
      memoryDb.vehicles[index].quantity = Math.max(0, memoryDb.vehicles[index].quantity - dec);
      return { rows: [memoryDb.vehicles[index]] };
    }

    // Check if quantity restock query
    if (sql.includes('quantity = quantity +')) {
      const inc = parseInt(params[0]) || 1;
      memoryDb.vehicles[index].quantity += inc;
      return { rows: [memoryDb.vehicles[index]] };
    }

    const make = params[0];
    const model = params[1];
    const year = parseInt(params[2]);
    const category = params[3];
    const price = parseFloat(params[4]);
    const quantity = parseInt(params[5]);
    const image_url = params[6];
    const description = params[7];

    memoryDb.vehicles[index] = {
      ...memoryDb.vehicles[index],
      make: make !== undefined ? make : memoryDb.vehicles[index].make,
      model: model !== undefined ? model : memoryDb.vehicles[index].model,
      year: !isNaN(parseInt(year)) ? parseInt(year) : memoryDb.vehicles[index].year,
      category: category !== undefined ? category : memoryDb.vehicles[index].category,
      price: !isNaN(parseFloat(price)) ? parseFloat(price) : memoryDb.vehicles[index].price,
      quantity: !isNaN(parseInt(quantity)) ? parseInt(quantity) : memoryDb.vehicles[index].quantity,
      image_url: image_url !== undefined ? image_url : memoryDb.vehicles[index].image_url,
      description: description !== undefined ? description : memoryDb.vehicles[index].description
    };

    return { rows: [memoryDb.vehicles[index]] };
  }

  // INSERT Purchase Record
  if (sql.includes('insert into purchases')) {
    const user_id = params[0];
    const vehicle_id = params[1];
    const quantity = params[2] || 1;
    const total_price = params[3];

    const newPurchase = {
      id: memoryDb.purchaseIdSeq++,
      user_id,
      vehicle_id,
      quantity,
      total_price,
      purchased_at: new Date().toISOString()
    };
    memoryDb.purchases.push(newPurchase);
    return { rows: [newPurchase] };
  }

  // DELETE Vehicle
  if (sql.includes('delete from vehicles where id =')) {
    const targetId = parseInt(params[0]);
    const index = memoryDb.vehicles.findIndex(v => v.id === targetId);
    if (index === -1) return { rows: [] };
    const deleted = memoryDb.vehicles.splice(index, 1);
    return { rows: deleted };
  }

  return { rows: [] };
}

module.exports = {
  query,
  memoryDb,
  searchInMemoryVehicles,
  pool
};
