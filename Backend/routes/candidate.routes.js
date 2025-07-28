const express = require("express");
const router = express.Router();
const db = require("../db");
const { format } = require("date-fns");

const formatDate = (dateStr) => {
  return format(new Date(dateStr), "dd-MM-yyyy"); // or your desired format
};

// GET all candidates
router.get("/GetAllcandidate", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Candidate");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add or update candidate
router.post("/AddOrUpdateCandidate", async (req, res) => {
  const c = req.body;

  try {
    const createdDate = formatDate(c.createdDate || new Date());
    if (c.candidateId && c.candidateId !== 0) {
      // Update
      await db.query(
        `UPDATE Candidate SET 
    name = ?, gender = ?, address = ?, mobileNumber = ?, doj = ?, 
    serviceId = ?, packageId = ?, branchId = ?, packageMonths = ?, packageAmount = ?, 
    balanceAmount = ?, fromDate = ?, toDate = ?, paymentStatus = ?, 
    fingerPrintID = ?, isActive = ?, createdDate = ?
  WHERE candidateId = ?`,
        [
          c.name,
          c.gender,
          c.address,
          c.mobileNumber,
          c.doj,
          c.serviceId,
          c.packageId,
          c.branchId,
          c.packageMonths,
          c.packageAmount,
          c.balanceAmount,
          c.fromDate,
          c.toDate,
          c.paymentStatus,
          c.fingerPrintID,
          c.isActive,
          c.createdDate,
          c.candidateId,
        ]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO Candidate ( name, gender, address, mobileNumber, doj, 
        serviceId, packageId, branchId, packageMonths, packageAmount, 
        balanceAmount, fromDate, toDate, paymentStatus, 
        fingerPrintID, isActive, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          c.name,
          c.gender,
          c.address,
          c.mobileNumber,
          c.doj,
          c.serviceId,
          c.packageId,
          c.branchId,
          c.packageMonths,
          c.packageAmount,
          c.balanceAmount,
          c.fromDate,
          c.toDate,
          c.paymentStatus,
          c.fingerPrintID,
          c.isActive,
          c.createdDate,
        ]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
