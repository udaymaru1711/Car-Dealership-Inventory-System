const bcrypt = require('bcryptjs');
const db = require('../config/dbWrapper');

/**
 * Register a new user or admin
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Determine user role (defaults to 'user')
    const userRole = role === 'admin' ? 'admin' : 'user';

    // Save user to database
    const insertResult = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, userRole]
    );

    const newUser = insertResult.rows[0];

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

module.exports = {
  register
};
