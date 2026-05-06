const app = require('./app');
const CronService = require('./services/cron.service');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize scheduled tasks
  CronService.init();
});