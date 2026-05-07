const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../database');
const otplib = require('otplib');
const qrcode = require('qrcode');
const authEncryption = require('./auth.encryption');
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
  const user = await db.oneOrNone('SELECT id, email, hashed_password, role, is_active, created_at, two_factor_enabled FROM users WHERE email = $1', [email]);

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
 * Verify 2FA token OR Recovery Code and issue JWT
 */
exports.login2FA = async (userId, token) => {
  const user = await db.oneOrNone('SELECT id, email, role, is_active, created_at, two_factor_enabled, two_factor_secret, recovery_codes FROM users WHERE id = $1', [userId]);

  if (!user || !user.two_factor_enabled) return null;

  const cleanToken = token.trim().toUpperCase();

  // 1. Try TOTP Verification (6-digit numeric)
  if (cleanToken.length === 6 && /^\d+$/.test(cleanToken)) {
    const decryptedSecret = authEncryption.decrypt(user.two_factor_secret);
    if (decryptedSecret) {
      // Use totp.check for more reliable direct verification in this environment
      const isValid = otplib.totp.check(cleanToken, decryptedSecret);
      
      if (isValid) return this.issueSession(user);
    }
  }

  // 2. Try Recovery Code Verification (XXXX-XXXX format)
  if (user.recovery_codes && user.recovery_codes.length > 0) {
    for (const hashedCode of user.recovery_codes) {
      const isMatch = await bcrypt.compare(cleanToken, hashedCode);
      if (isMatch) {
        // Remove used code
        const remainingCodes = user.recovery_codes.filter(c => c !== hashedCode);
        await db.none('UPDATE users SET recovery_codes = $1 WHERE id = $2', [remainingCodes, userId]);
        return this.issueSession(user);
      }
    }
  }

  // Explicitly return null if no validation passed
  return null;
};

/**
 * Helper to issue a full session after successful auth
 */
exports.issueSession = (user) => {
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

  const secret = otplib.generateSecret(20); 
  
  const label = encodeURIComponent(`Portfolio:${user.email}`);
  const issuer = encodeURIComponent('PortfolioAdmin');
  const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
  
  const qrCodeDataURL = await qrcode.toDataURL(otpauth);

  return { secret, qrCodeDataURL };
};

/**
 * Verify and enable 2FA
 * Returns recovery codes for the user to save.
 */
exports.verifyAndEnable2FA = async (userId, secret, token) => {
  const isValid = otplib.totp.check(token, secret);
  if (!isValid) return null;

  // 1. Encrypt the secret for storage
  const encryptedSecret = authEncryption.encrypt(secret);

  // 2. Generate 10 recovery codes
  const plainRecoveryCodes = authEncryption.generateRecoveryCodes();
  
  // 3. Hash them for storage (standard bcrypt)
  const hashedRecoveryCodes = await Promise.all(
    plainRecoveryCodes.map(code => bcrypt.hash(code, 10))
  );

  // 4. Update DB
  await db.none(
    'UPDATE users SET two_factor_secret = $1, two_factor_enabled = true, recovery_codes = $2 WHERE id = $3', 
    [encryptedSecret, hashedRecoveryCodes, userId]
  );

  return plainRecoveryCodes;
};

/**
 * Disable 2FA
 */
exports.disable2FA = async (userId) => {
  await db.none('UPDATE users SET two_factor_secret = null, two_factor_enabled = false, recovery_codes = null WHERE id = $1', [userId]);
  return true;
};

/**
 * Get user by ID
 */
exports.getUserById = async (userId) => {
  return db.oneOrNone('SELECT id, email, role, is_active, created_at, two_factor_enabled FROM users WHERE id = $1', [userId]);
};