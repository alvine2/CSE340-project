const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db/connection"); // adjust to your DB connection

router.get("/seed-users", async (req, res) => {
  try {
    const users = [
      { email: "grader+admin@example.com", password: "AdminPass123!", role: "admin" },
      { email: "grader+manager@example.com", password: "ManagerPass123!", role: "manager" },
      { email: "grader+user@example.com", password: "UserPass123!", role: "user" },
    ];

    for (let user of users) {
      const hashed = await bcrypt.hash(user.password, 10);

      await pool.query(
        `INSERT INTO users (email, password, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING`,
        [user.email, hashed, user.role]
      );
    }

    res.send("Seed users created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error seeding users.");
  }
});

module.exports = router;
