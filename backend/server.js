const app = require('./app');
const CronService = require('./services/cron.service');
const MigrationService = require('./services/migration.service');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 1. Run Migrations
    await MigrationService.runMigrations();

    // 2. Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // 3. Initialize scheduled tasks
      CronService.init();
    });
  } catch (error) {
    console.error('FATAL_BOOTSTRAP_ERROR:', error);
    process.exit(1);
  }
}

bootstrap();