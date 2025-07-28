const express = require("express");
const router = express.Router();
const db = require("../db"); // Make sure this points to your DB connection

// ========= SERVICE ROUTES =========
router.get("/GetallServicetable", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Service");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/AddServicetable", async (req, res) => {
  const { serviceName } = req.body;
  try {
    await db.query("INSERT INTO Service (serviceName) VALUES (?)", [serviceName]);
    res.json({ success: true, message: "Service added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========= PACKAGE ROUTES =========
router.get("/GetAllPackagetable", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Package");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/AddPackagetable", async (req, res) => {
  const { packageName, packageAmount } = req.body;
  try {
    await db.query(
      "INSERT INTO Package (packageName, packageAmount) VALUES (?, ?)",
      [packageName, packageAmount]
    );
    res.json({ success: true, message: "Package added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ========= Branch ROUTES =========
router.post("/AddBranch", async (req, res) => {
  const { branchName, location } = req.body;
  await db.query(
    `INSERT INTO Branch (branchName, location) VALUES (?, ?)`,
    [branchName, location]
  );
  res.json({ success: true });
});

router.get("/GetAllBranches", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Branch");
  res.json(rows);
});


module.exports = router;
