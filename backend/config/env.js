require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  CHATBOT_BASE_PRICE: '500',
  CHATBOT_HOURLY_RATE: '50'
};