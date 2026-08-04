// Usage: ADMIN_SEED_ACCOUNTS='[{"email":"you@example.com","password":"...","role":"admin"}]' node database/seeds/seed_admin_user.js
// ADMIN_SEED_ACCOUNTS must be set in the environment (e.g. backend/.env, never committed to git).
// It is a JSON array of { email, password, role }.

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config(); // Auto-load .env from backend/

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Check your .env file in backend/");
  process.exit(1);
}
console.log("Using DATABASE_URL: [redacted]");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (!process.env.ADMIN_SEED_ACCOUNTS) {
  console.error("❌ ADMIN_SEED_ACCOUNTS is not set. Provide a JSON array of { email, password, role } via env, e.g.:");
  console.error(`   ADMIN_SEED_ACCOUNTS='[{"email":"you@example.com","password":"a-strong-password","role":"admin"}]' npm run seed`);
  process.exit(1);
}

let accounts;
try {
  accounts = JSON.parse(process.env.ADMIN_SEED_ACCOUNTS);
  if (!Array.isArray(accounts) || accounts.length === 0) throw new Error('empty array');
} catch (err) {
  console.error("❌ ADMIN_SEED_ACCOUNTS must be valid, non-empty JSON array:", err.message);
  process.exit(1);
}

async function seedAdmins() {
  for (const { email, password, role } of accounts) {
    try {
      const saltRounds = 12;
      const hashed = await bcrypt.hash(password, saltRounds);

      const res = await pool.query(
        `INSERT INTO users (email, hashed_password, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING
         RETURNING id, email, role;`,
        [email, hashed, role]
      );

      if (res.rows.length > 0) {
        console.log(`✅ Admin user created:`, res.rows[0]);
      } else {
        console.log(`ℹ️ Admin user already exists for ${email}. No changes made.`);
      }
    } catch (err) {
      console.error(`❌ Error seeding admin for ${email}:`);
      // Print error details, including any env/password problems
      if (err.code && err.message) {
        console.error(`    Code: ${err.code}\n    Message: ${err.message}`);
      } else {
        console.error(err);
      }
    }
  }
  await pool.end();
}

seedAdmins();