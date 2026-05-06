const runner = require('node-pg-migrate');
const path = require('path');
require('dotenv').config();

const MigrationService = {
  async runMigrations() {
    console.log('[MIGRATION] Starting automatic schema sync...');
    
    // Safety trim for common env var copy-paste issues
    const databaseUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : null;

    if (!databaseUrl) {
      console.warn('[MIGRATION] SKIPPED: DATABASE_URL is missing.');
      return;
    }

    const options = {
      databaseUrl,
      dir: path.join(__dirname, '../migrations'),
      direction: 'up',
      migrationsTable: 'pgmigrations',
      verbose: true
    };

    try {
      // Handle both ESM and CJS export patterns
      const migrate = runner.default || runner;
      await migrate(options);
      console.log('[MIGRATION] Schema is up to date.');
    } catch (error) {
      console.error('[MIGRATION] Error during schema sync:', error);
      // We don't necessarily want to crash the server if migrations fail, 
      // but the app might be in an inconsistent state.
    }
  }
};

module.exports = MigrationService;
