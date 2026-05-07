const crypto = require('crypto');

/**
 * Advanced Encryption Utility (AES-256-GCM)
 * Used to protect 2FA secrets at rest.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// Fallback to a derivated key if 2FA_ENCRYPTION_KEY is missing
// In production, the user MUST set 2FA_ENCRYPTION_KEY (32 bytes hex)
const getSecretKey = () => {
  const key = process.env.TWO_FACTOR_ENCRYPTION_KEY || process.env.JWT_SECRET || 'fallback-very-secret-key-32-chars-!!';
  return crypto.createHash('sha256').update(key).digest();
};

/**
 * Encrypts plain text
 * Returns format: iv:authTag:encryptedText
 */
exports.encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts text
 */
exports.decrypt = (cipherText) => {
  if (!cipherText) return null;
  try {
    const [ivHex, authTagHex, encryptedText] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('[ENCRYPTION] Decryption failed:', err.message);
    return null;
  }
};

/**
 * Generates 10 secure recovery codes
 */
exports.generateRecoveryCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    // Format: XXXX-XXXX (8 chars)
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
};
