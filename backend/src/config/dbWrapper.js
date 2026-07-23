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

  // Vehicle CRUD Queries

  // GET All Vehicles
  if (sql.includes('select * from vehicles order by id desc')) {
    return { rows: [...memoryDb.vehicles].sort((a, b) => b.id - a.id) };
  }

  if (sql.includes('select * from vehicles where id =')) {
    const id = parseInt(params[0]);
    const vehicle = memoryDb.vehicles.find(v => v.id === id);
    return { rows: vehicle ? [vehicle] : [] };
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

  // UPDATE Vehicle
  if (sql.includes('update vehicles')) {
    const targetId = parseInt(params[params.length - 1]);
    const index = memoryDb.vehicles.findIndex(v => v.id === targetId);
    if (index === -1) {
      // If not found by last param, check first param or search by id
      const altIndex = memoryDb.vehicles.findIndex(v => v.id === parseInt(params[0]));
      if (altIndex === -1) return { rows: [] };
      memoryDb.vehicles[altIndex] = {
        ...memoryDb.vehicles[altIndex],
        price: params[1] !== undefined ? parseFloat(params[1]) : memoryDb.vehicles[altIndex].price,
        quantity: params[2] !== undefined ? parseInt(params[2]) : memoryDb.vehicles[altIndex].quantity
      };
      return { rows: [memoryDb.vehicles[altIndex]] };
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
      make,
      model,
      year,
      category,
      price,
      quantity,
      image_url,
      description
    };

    return { rows: [memoryDb.vehicles[index]] };
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
  pool
};
