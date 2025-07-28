const express = require("express");
const router = express.Router();
const db = require("../db");
const { format } = require("date-fns");
const { sendCandidateEnrollmentNotification } = require("../utils/sendMail");
const formatDate = (dateStr) => {
  return format(new Date(dateStr), "yyyy-MM-dd"); // or your desired format
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
      // Update existing candidate
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
          createdDate,
          c.candidateId,
        ]
      );
    } else {
      // Insert new candidate
      await db.query(
        `INSERT INTO Candidate (name, gender, address, mobileNumber, doj, 
          serviceId, packageId, branchId, packageMonths, packageAmount, 
          balanceAmount, fromDate, toDate, paymentStatus, 
          fingerPrintID, isActive, createdDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          createdDate,
        ]
      );

      // Send notification email only for new candidate
      const [branch] = await db.query("SELECT branchName FROM Branch WHERE branchId = ?", [c.branchId]);
      const [packageInfo] = await db.query("SELECT packageName FROM Package WHERE packageId = ?", [c.packageId]);

      const enrichedCandidate = {
        name: c.name,
        mobileNumber: c.mobileNumber,
        createdBy: c.createdBy || "Unknown Trainer",
        doj: formatDate(c.doj),
        packageName: packageInfo[0]?.packageName || "N/A",
        packageAmount: c.packageAmount,
        branchName: branch[0]?.branchName || "N/A",
      };

      await sendCandidateEnrollmentNotification(enrichedCandidate);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in AddOrUpdateCandidate:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
