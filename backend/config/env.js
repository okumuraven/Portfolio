require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : null;

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: databaseUrl,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  RECOVERY_GEMINI_API_KEY: process.env.RECOVERY_GEMINI_API_KEY,
  CHATBOT_BASE_PRICE: '500',
  CHATBOT_HOURLY_RATE: '50'
};