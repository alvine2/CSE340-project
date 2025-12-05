// scripts/seedUsersPg.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../database'); // uses the same database module in your project

async function enumHasValue(enumName, value) {
  const q = `
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = $1 AND e.enumlabel = $2
    LIMIT 1
  `;
  const r = await pool.query(q, [enumName, value]);
  return r.rows.length > 0;
}

async function addEnumValue(enumName, value) {
  // ALTER TYPE ... ADD VALUE IF NOT EXISTS is only available in PG 14+.
  // We'll check and then add if missing.
  const exists = await enumHasValue(enumName, value);
  if (exists) {
    console.log(`Enum ${enumName} already has value '${value}'`);
    return;
  }
  console.log(`Adding enum value '${value}' to enum type '${enumName}'`);
  // Note: adding a value appends it to the end; that's fine for this use case.
  await pool.query(`ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS $1`, [value])
    .catch(async (err) => {
      // Some Postgres versions don't support parameterized ALTER TYPE with IF NOT EXISTS,
      // try fallback string interpolation (safe because value is controlled)
      if (err) {
        console.log('Fallback ALTER TYPE (string interpolation) because first attempt failed:', err.message || err);
        await pool.query(`ALTER TYPE ${enumName} ADD VALUE '${value}'`);
      }
    });
}

(async () => {
  try {
    console.log('Checking enum and seeding users...');

    // Adjust this if the enum type name is different in your DB
    const enumName = 'account_type';

    // desired labels
    const needed = ['admin', 'manager', 'user'];

    // Ensure enum contains needed labels
    for (const val of needed) {
      const exists = await enumHasValue(enumName, val);
      if (!exists) {
        // add the value
        // Use a direct ALTER if parameterized version fails on some PG versions
        try {
          console.log(`Adding enum label '${val}' to ${enumName}`);
          await pool.query(`ALTER TYPE ${enumName} ADD VALUE '${val}';`);
          console.log(`Added '${val}'`);
        } catch (err) {
          // If race or ordering issue occurs, log and continue
          console.warn(`Could not add enum value '${val}':`, err.message || err);
        }
      } else {
        console.log(`Enum already contains '${val}'`);
      }
    }

    // Prepare users
    const users = [
      { first: 'Grader', last: 'Admin', email: 'admin@example.com', role: 'admin', pw: 'AdminPass123!' },
      { first: 'Grader', last: 'Manager', email: 'manager@example.com', role: 'manager', pw: 'ManagerPass123!' },
      { first: 'Grader', last: 'User', email: 'user@example.com', role: 'user', pw: 'UserPass123!' }
    ];

    for (const u of users) {
      const found = await pool.query('SELECT account_id FROM account WHERE account_email = $1', [u.email]);
      if (found.rows.length) {
        console.log(`Skipping (exists): ${u.email}`);
        continue;
      }
      const hash = await bcrypt.hash(u.pw, 10);
      await pool.query(
        `INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
         VALUES ($1, $2, $3, $4, $5)`,
        [u.first, u.last, u.email, hash, u.role]
      );
      console.log(`Created: ${u.email}`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message || err);
    process.exit(1);
  }
})();
