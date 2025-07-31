const express = require("express");
const router = express.Router();
const db = require("../db");

// 1. Expiring Packages (within 7 days)
router.get("/expiring-packages", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS expiringSoon
        FROM candidate
        WHERE DATEDIFF(toDate, CURDATE()) BETWEEN 0 AND 5 AND isActive = 1;
        `,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Expiring packages error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Pending Fee Candidates
router.get("/pending-fees", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS pendingFeesCount
        FROM candidate
        WHERE balanceAmount > 0 AND isActive = 1;
        `,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Pending fee error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Active Candidates Count
router.get("/active-candidates", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS activeCount FROM candidate WHERE isActive = 1;`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Active candidates count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 4. Trainer Profile Summary
router.get("/profile", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT name, mobileNumber, age, joiningDate
       FROM trainer
       WHERE trainerId = ?`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Trainer profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
