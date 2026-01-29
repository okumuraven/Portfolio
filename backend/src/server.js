const app = require('./app');

// Try loading PORT from env/config, fallback to 5000
const port = process.env.PORT || 5000;

// Optionally: Log a warning if not set by environment
if (!process.env.PORT) {
  console.warn("[WARN] No PORT specified in .env; defaulting to 5000");
}

app.listen(port, () => {
  console.log(`✅ Backend server running on port ${port}`);
});

// Optional: Global error handlers (future expansion)
/*
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE ERROR:', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
*/