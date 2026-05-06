const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

const MigrationService = {
  async runMigrations() {
    console.log('[MIGRATION] Initializing Brute-Force Schema Sync...');
    
    const databaseUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim() : null;

    if (!databaseUrl) {
      console.warn('[MIGRATION] CRITICAL_WARNING: DATABASE_URL is missing. Skipping migrations.');
      return;
    }

    try {
      // We use the CLI runner via execSync because it is the most reliable way 
      // to ensure environment variables and pg-driver versions match perfectly.
      const migrationCmd = `npx node-pg-migrate up --database-url "${databaseUrl}" -m migrations`;
      
      console.log('[MIGRATION] Executing CLI migration runner...');
      const output = execSync(migrationCmd, { 
        cwd: path.join(__dirname, '..'), // Run from /backend directory
        encoding: 'utf8' 
      });
      
      console.log('[MIGRATION] Success Output:\n', output);
      console.log('[MIGRATION] Database schema is now synchronized.');
    } catch (error) {
      console.error('[MIGRATION] FATAL_ERROR: Migration CLI failed.');
      if (error.stdout) console.log('[MIGRATION] CLI_STDOUT:', error.stdout);
      if (error.stderr) console.error('[MIGRATION] CLI_STDERR:', error.stderr);
      
      // Re-throw to be caught by bootstrap in server.js
      throw error;
    }
  }
};

module.exports = MigrationService;
