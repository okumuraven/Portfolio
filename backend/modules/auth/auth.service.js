const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Login service: validate user and issue JWT or 2FA challenge
 * @param {string} email
 * @param {string} plainPassword
 * @returns {Promise<{token?: string, user: object, twoFactorRequired?: boolean} | null>}
 */
exports.login = async (email, plainPassword) => {
  // 1. User lookup
  const query = 'SELECT id, email, hashed_password, role, is_active, created_at, two_factor_enabled, two_factor_secret FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  const user = rows[0];

  if (!user || user.is_active === false) {
    return null;
  }

  // 2. Verify password hash
  const valid = await bcrypt.compare(plainPassword, user.hashed_password);
  if (!valid) {
    return null;
  }

  // 3. Check if 2FA is enabled
  if (user.two_factor_enabled) {
    return {
      twoFactorRequired: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 4. Create JWT (No 2FA or not enabled)
  const token = this.generateToken(user);

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
 * Verify 2FA token and issue JWT
 */
exports.login2FA = async (userId, token) => {
  const query = 'SELECT id, email, role, is_active, created_at, two_factor_enabled, two_factor_secret FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [userId]);
  const user = rows[0];

  if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
    return null;
  }

  const isValid = authenticator.verify({
    token,
    secret: user.two_factor_secret,
  });

  if (!isValid) {
    return null;
  }

  const accessToken = this.generateToken(user);

  return {
    token: accessToken,
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
 * Generate a JWT token
 */
exports.generateToken = (user) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET || "devtopsecret";
  return jwt.sign(jwtPayload, secret, { expiresIn: '2h' });
};

/**
 * Setup 2FA: Generate secret and QR code
 */
exports.setup2FA = async (userId) => {
  const query = 'SELECT email FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [userId]);
  const user = rows[0];

  if (!user) throw new Error('User not found');

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, 'PortfolioAdmin', secret);
  const qrCodeDataURL = await qrcode.toDataURL(otpauth);

  // We don't save it yet; we only save after verification
  return { secret, qrCodeDataURL };
};

/**
 * Verify and enable 2FA
 */
exports.verifyAndEnable2FA = async (userId, secret, token) => {
  const isValid = authenticator.verify({ token, secret });
  if (!isValid) return false;

  const query = 'UPDATE users SET two_factor_secret = $1, two_factor_enabled = true WHERE id = $2';
  await pool.query(query, [secret, userId]);
  return true;
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (userId) => {
  const query = 'UPDATE users SET two_factor_secret = null, two_factor_enabled = false WHERE id = $1';
  await pool.query(query, [userId]);
  return true;
};

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  const query = 'SELECT id, email, role, is_active, created_at, two_factor_enabled FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [userId]);
  return rows[0] || null;
};