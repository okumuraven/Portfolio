const app = require('./app');

// Use dotenv/config loader or custom config if needed
// If you want to load settings, do it here or in config/env.js

const port = process.env.PORT || 5000;

// Optional: Warn if no PORT set
if (!process.env.PORT) {
  console.warn('[WARN] No PORT specified in .env; defaulting to 5000');
}

app.listen(port, () => {
  console.log(`✅ Backend server running on port ${port}`);
});

// ---- Optional: Global error handlers for stability (recommended for prod) ----
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE ERROR:', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});