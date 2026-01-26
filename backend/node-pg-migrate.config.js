module.exports = {
  migrationsDir: 'migrations',    // <--- correct!
  direction: 'up',
  databaseUrl: process.env.DATABASE_URL
};