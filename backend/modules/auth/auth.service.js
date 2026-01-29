const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Login service: validate user and issue JWT
 * @param {string} email
 * @param {string} plainPassword
 * @returns {Promise<{token: string, user: object} | null>}
 */
exports.login = async (email, plainPassword) => {
  // 1. User lookup
  const query = 'SELECT id, email, hashed_password, role, is_active, created_at FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  const user = rows[0];

  if (!user) {
    // User not found
    return null;
  }
  // Optional: Check user is_active, etc.
  if (user.is_active === false) {
    // User exists but deactivated
    return null;
  }

  // 2. Verify password hash
  const valid = await bcrypt.compare(plainPassword, user.hashed_password);
  if (!valid) {
    // Wrong password
    return null;
  }

  // 3. Create JWT
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET || "devtopsecret";
  const token = jwt.sign(jwtPayload, secret, { expiresIn: '2h' });

  // 4. Return token and user fields (exclude hashed_password)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
    },
  };
};

/**
 * (Optional) Get user by ID
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
exports.getUserById = async (userId) => {
  const query = 'SELECT id, email, role, is_active, created_at FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [userId]);
  return rows[0] || null;
};