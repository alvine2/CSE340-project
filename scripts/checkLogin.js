// scripts/checkLogin.js
require('dotenv').config();
const pool = require('../database');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const email = 'grader+manager@example.com';
    const plain = 'ManagerPass123!';
    const r = await pool.query('SELECT account_password FROM account WHERE account_email = $1', [email]);
    if (!r.rows.length) return console.log('No user found');
    const hash = r.rows[0].account_password;
    const ok = await bcrypt.compare(plain, hash);
    console.log('Password match?', ok);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
