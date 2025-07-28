const express = require("express");
const router = express.Router();
// const mysql = require("mysql2");
require("dotenv").config();
const db = require("../db");

// POST /Bio/Login
router.post("/Bio/Login", async (req, res) => {
  const { userName, password, role } = req.body;

  if (!userName || !password || !role) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM login_auth WHERE userName = ? AND password = ? AND role = ?",
      [userName, password, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    return res.json({
      id: user.id,
      userName: user.userName,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /Bio/AuthenticateTrainerLogin
router.post("/Bio/AuthenticateTrainerLogin", async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM login_auth WHERE userName = ? AND password = ? AND role = 'trainer'",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Trainer authentication failed" });
    }

    // You can trigger notification or logging here if needed
    return res.status(200).json({ message: "Trainer authenticated" });
  } catch (err) {
    console.error("Trainer Auth Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
