// Usage: ADMIN_ROTATE_ACCOUNTS='[{"email":"you@example.com","newPassword":"..."}]' node database/seeds/rotate_admin_passwords.js
// ADMIN_ROTATE_ACCOUNTS must be set in the environment. It is a JSON array of
// { email, newPassword } for existing accounts whose password should be changed.
// Unlike seed_admin_user.js (INSERT ... ON CONFLICT DO NOTHING), this UPDATEs
// the hashed_password of accounts that already exist.

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

if (!process.env.ADMIN_ROTATE_ACCOUNTS) {
  console.error("❌ ADMIN_ROTATE_ACCOUNTS is not set. Provide a JSON array of { email, newPassword } via env, e.g.:");
  console.error(`   ADMIN_ROTATE_ACCOUNTS='[{"email":"you@example.com","newPassword":"a-new-strong-password"}]' node database/seeds/rotate_admin_passwords.js`);
  process.exit(1);
}

let accounts;
try {
  accounts = JSON.parse(process.env.ADMIN_ROTATE_ACCOUNTS);
  if (!Array.isArray(accounts) || accounts.length === 0) throw new Error('empty array');
} catch (err) {
  console.error("❌ ADMIN_ROTATE_ACCOUNTS must be a valid, non-empty JSON array:", err.message);
  process.exit(1);
}

async function rotatePasswords() {
  for (const { email, newPassword } of accounts) {
    try {
      const saltRounds = 12;
      const hashed = await bcrypt.hash(newPassword, saltRounds);

      const res = await pool.query(
        `UPDATE users SET hashed_password = $1 WHERE email = $2 RETURNING id, email, role;`,
        [hashed, email]
      );

      if (res.rows.length > 0) {
        console.log(`✅ Password rotated for:`, res.rows[0]);
      } else {
        console.log(`⚠️ No user found for ${email}. No changes made.`);
      }
    } catch (err) {
      console.error(`❌ Error rotating password for ${email}:`);
      if (err.code && err.message) {
        console.error(`    Code: ${err.code}\n    Message: ${err.message}`);
      } else {
        console.error(err);
      }
    }
  }
  await pool.end();
}

rotatePasswords();
