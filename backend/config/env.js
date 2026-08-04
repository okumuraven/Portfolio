require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : null;

// Fail fast on missing/weak secrets rather than silently falling back to a
// hardcoded default that would be identical across every deployment of this repo.
function requireSecret(name, minLength = 16) {
  const value = process.env[name];
  if (!value || value.trim().length < minLength) {
    throw new Error(
      `Missing or too-short required environment variable ${name}. ` +
      `Set it to a long random secret (e.g. \`openssl rand -hex 32\`) before starting the server.`
    );
  }
  return value.trim();
}

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: databaseUrl,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  RECOVERY_GEMINI_API_KEY: process.env.RECOVERY_GEMINI_API_KEY,
  CHATBOT_BASE_PRICE: '500',
  CHATBOT_HOURLY_RATE: '50',
  JWT_SECRET: requireSecret('JWT_SECRET'),
  TWO_FACTOR_ENCRYPTION_KEY: requireSecret('TWO_FACTOR_ENCRYPTION_KEY'),
};