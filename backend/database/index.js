const pgp = require('pg-promise')();
const config = require('../config/env');

if (!config.DATABASE_URL) {
  console.error('[DATABASE] CRITICAL_ERROR: DATABASE_URL is undefined.');
} else {
  // Log partially masked URL for safety
  const maskedUrl = config.DATABASE_URL.replace(/:([^@]+)@/, ':****@');
  console.log(`[DATABASE] Initializing connection to: ${maskedUrl.split('@')[1]}`);
}

const db = pgp(config.DATABASE_URL);

// Test connection
db.connect()
  .then(obj => {
    console.log('[DATABASE] Connection successful.');
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.error('[DATABASE] Connection failure:', error.message || error);
  });

module.exports = db;