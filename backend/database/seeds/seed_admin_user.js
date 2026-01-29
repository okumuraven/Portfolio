// Usage: node database/seeds/seed_admin_user.js

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config(); // Auto-load .env from backend/

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Check your .env file in backend/");
  process.exit(1);
}
console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// === Add as many accounts as you want below ===
const accounts = [
  {
    email: 'okumuraven@gmail.com',
    password: 'Kingbeez@254',
    role: 'admin',
  },
  {
    email: 'joseravelinux@gmail.com',
    password: 'Kingbeez@2026',
    role: 'admin',
  },
];

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