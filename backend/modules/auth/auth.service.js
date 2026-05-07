const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../database');
const otplib = require('otplib');
const qrcode = require('qrcode');
require('dotenv').config();

// Standard TOTP configuration for Google Authenticator compatibility
const totpConfig = {
  step: 30,
  digits: 6,
  algorithm: 'sha1',
  encoding: 'base32'
};

/**
 * Login service: validate user and issue JWT or 2FA challenge
 */
exports.login = async (email, plainPassword) => {
  const user = await db.oneOrNone('SELECT id, email, hashed_password, role, is_active, created_at, two_factor_enabled, two_factor_secret FROM users WHERE email = $1', [email]);

  if (!user || user.is_active === false) return null;

  const valid = await bcrypt.compare(plainPassword, user.hashed_password);
  if (!valid) return null;

  if (user.two_factor_enabled) {
    return {
      twoFactorRequired: true,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  const token = exports.generateToken(user);
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
  const user = await db.oneOrNone('SELECT id, email, role, is_active, created_at, two_factor_enabled, two_factor_secret FROM users WHERE id = $1', [userId]);

  if (!user || !user.two_factor_enabled || !user.two_factor_secret) return null;

  const isValid = otplib.verify({
    token,
    secret: user.two_factor_secret,
    ...totpConfig
  });

  if (!isValid) return null;

  const accessToken = exports.generateToken(user);
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
  const jwtPayload = { userId: user.id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || "devtopsecret";
  return jwt.sign(jwtPayload, secret, { expiresIn: '2h' });
};

/**
 * Setup 2FA: Generate secret and QR code
 */
exports.setup2FA = async (userId) => {
  const user = await db.oneOrNone('SELECT email FROM users WHERE id = $1', [userId]);
  if (!user) throw new Error('User not found');

  const secret = otplib.generateSecret(20); // 20 bytes for strong secret
  const otpauth = otplib.generateURI(user.email, 'PortfolioAdmin', secret, totpConfig);
  const qrCodeDataURL = await qrcode.toDataURL(otpauth);

  return { secret, qrCodeDataURL };
};

/**
 * Verify and enable 2FA
 */
exports.verifyAndEnable2FA = async (userId, secret, token) => {
  const isValid = otplib.verify({ token, secret, ...totpConfig });
  if (!isValid) return false;

  await db.none('UPDATE users SET two_factor_secret = $1, two_factor_enabled = true WHERE id = $2', [secret, userId]);
  return true;
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (userId) => {
  await db.none('UPDATE users SET two_factor_secret = null, two_factor_enabled = false WHERE id = $1', [userId]);
  return true;
};

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  return db.oneOrNone('SELECT id, email, role, is_active, created_at, two_factor_enabled FROM users WHERE id = $1', [userId]);
};