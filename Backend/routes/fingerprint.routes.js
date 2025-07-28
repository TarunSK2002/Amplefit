const express = require("express");
const router = express.Router();
const db = require("../db"); // Make sure db.js is correctly configured

// POST: Add a new fingerprint record
router.post("/AddFingerprint", async (req, res) => {
  const { role, fingerPrint1, fingerPrint2, fingerPrint3 } = req.body;

  if (!role || !fingerPrint1 || !fingerPrint2 || !fingerPrint3) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Fingerprint (role, fingerPrint1, fingerPrint2, fingerPrint3)
       VALUES (?, ?, ?, ?)`,
      [role, fingerPrint1, fingerPrint2, fingerPrint3]
    );

    res.json({ success: true, message: "Fingerprint saved", insertedId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Retrieve all fingerprint records
router.get("/GetAllFingerprints", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Fingerprint ORDER BY fingerPrintID DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a fingerprint by ID
router.delete("/DeleteFingerprint/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM Fingerprint WHERE fingerPrintID = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Fingerprint not found" });
    }

    res.json({ success: true, message: "Fingerprint deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
