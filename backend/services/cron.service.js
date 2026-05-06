const cron = require('node-cron');
const RecoveryService = require('../modules/recovery/recovery.service');

const CronService = {
  init() {
    // Schedule daily briefing at 8:00 AM
    // Structure: minute hour day-of-month month day-of-week
    cron.schedule('0 8 * * *', async () => {
      console.log('[CRON] Executing Daily Recovery Briefing...');
      try {
        await RecoveryService.generateDailyBriefing();
        console.log('[CRON] Daily Briefing completed successfully.');
      } catch (error) {
        console.error('[CRON] Daily Briefing failed:', error);
      }
    });

    console.log('[CRON] Scheduled Tasks Initialized.');
  }
};

module.exports = CronService;
