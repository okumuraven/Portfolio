const pgp = require('pg-promise')();
const config = require('../config/env');

// Robust logging for database connection
try {
  if (!config.DATABASE_URL) {
    console.warn('[DATABASE] WARNING: DATABASE_URL is not defined in environment.');
  } else {
    // Safely mask and log connection info
    const urlParts = config.DATABASE_URL.split('@');
    if (urlParts.length > 1) {
      const hostPart = urlParts[1].split('/')[0];
      console.log(`[DATABASE] Target Host: ${hostPart}`);
    } else {
      console.log('[DATABASE] Initializing with non-standard connection string.');
    }
  }
} catch (logErr) {
  console.warn('[DATABASE] Could not log connection details safely.');
}

// Create the database instance
const db = pgp(config.DATABASE_URL || '');

// Test connection asynchronously
db.connect()
  .then(obj => {
    console.log('[DATABASE] Connection successful.');
    obj.done();
  })
  .catch(error => {
    console.error('[DATABASE] Connection failure:', error.message || error);
  });

module.exports = db;
