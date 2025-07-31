const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Candidate Report
router.get("/GetCandidateReportByDate", async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM candidate WHERE createdDate BETWEEN ? AND ?`,
      [fromDate, toDate]
    );
    res.json(rows);
  } catch (err) {
    console.error("Candidate Report Error:", err.message || err);
    res.status(500).send("Server Error");
  }
});

// ✅ Trainer Report
router.get("/GetTrainerReportByDate", async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM trainer WHERE createdDate BETWEEN ? AND ?`,
      [fromDate, toDate]
    );
    res.json(rows);
  } catch (err) {
    console.error("Trainer Report Error:", err.message || err);
    res.status(500).send("Server Error");
  }
});

// ✅ Attendance Report
router.get('/GetAttendanceReportByDate', async (req, res) => {
  const { fromDate, toDate } = req.query;

  try {
    const [rows] = await pool.execute(
      `SELECT a.*, c.name AS candidateName
       FROM attendance a
       JOIN candidate c ON a.candidateId = c.candidateId
       WHERE a.attendanceDate BETWEEN ? AND ?`,
      [fromDate, toDate]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ SQL Error:", err);  // Log the actual SQL or connection error
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Payment Report
router.get("/GetPaymentReportByDate", async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM payment WHERE createdDate BETWEEN ? AND ?`,
      [fromDate, toDate]
    );
    res.json(rows);
  } catch (err) {
    console.error("Payment Report Error:", err.message || err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
