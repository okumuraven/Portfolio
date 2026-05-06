const app = require('./app');
const CronService = require('./services/cron.service');
const MigrationService = require('./services/migration.service');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Run Migrations (Fatal if fails)
    await MigrationService.runMigrations();

    // 2. Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // 3. Initialize scheduled tasks
      CronService.init();
    });
  } catch (error) {
    console.error('CRITICAL_SYSTEM_HALT: Database Migrations Failed.');
    console.error('Reason:', error.message);
    // On Render, exiting with 1 will prevent the new version from becoming "Live" 
    // if the database isn't ready.
    process.exit(1);
  }
}

bootstrap();