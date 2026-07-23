const pool = require('./db');
const bcrypt = require('bcryptjs');

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

  // User Registration check email
  if (sql.includes('select * from users where email =')) {
    const email = params[0];
    const user = memoryDb.users.find(u => u.email === email);
    return { rows: user ? [user] : [] };
  }

  // Insert user
  if (sql.includes('insert into users')) {
    const name = params[0];
    const email = params[1];
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

  // Select user by id
  if (sql.includes('select * from users where id =')) {
    const id = parseInt(params[0]);
    const user = memoryDb.users.find(u => u.id === id);
    return { rows: user ? [user] : [] };
  }

  return { rows: [] };
}

module.exports = {
  query,
  memoryDb,
  pool
};
