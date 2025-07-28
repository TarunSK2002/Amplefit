// routes/attendance.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getSerialPort  } = require("../utils/serial");
const { port } = require("serialport");


// const { getSerialPort } = require("../serial");
const axios = require("axios"); // Ensure axios is installed for Arduino request
const port = require("../utils/serial");
// const { Op } = require("sequelize");
// Get all attendance records
router.get("/GetAllAttendance", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, c.name as candidateName 
      FROM Attendance a 
      LEFT JOIN Candidate c ON a.candidateId = c.candidateId
      ORDER BY a.attendanceDate DESC, a.inTime DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// exports.verifyAttendanceByCandidateId = async (req, res) => {
//   try {
//     const { candidateId } = req.body;

//     if (!candidateId) return res.status(400).json({ message: "candidateId required" });

//     const candidate = await Candidate.findOne({ where: { candidateId, isActive: true } });

//     if (!candidate) return res.status(404).json({ message: "Candidate not found" });

//     const today = new Date();
//     const toDate = new Date(candidate.toDate);
//     const balance = parseFloat(candidate.balanceAmount || 0);

//     // Check for validity
//     if (balance > 0 && today <= toDate) {
//       // Valid => send buzzoff (no alert)
//       port.write("buzzoff\n");
//       return res.status(200).json("Attendance marked successfully");
//     } else {
//       // Invalid => send buzzon (alert)
//       port.write("BUZZ_ON");
//       return res.status(200).json("Attendance marked, but candidate is inactive or has balance due");
//     }
//   } catch (err) {
//     console.error("Error verifying attendance:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// Add attendance by candidateId
// POST /Bio/VerifyAttendanceByCandidateId
// POST /Bio/VerifyAttendanceByFingerprintId
// POST /Bio/VerifyAttendanceByFingerprintId

// router.post("/VerifyAttendanceByFingerprintId", async (req, res) => {
//   console.log("🟢 Hit /VerifyAttendanceByFingerprintId");

//   const { fingerPrintID } = req.body;

//   if (!fingerPrintID) {
//     return res.status(400).json("fingerPrintID is required");
//   }

//   try {
//     // 1. Find candidate mapped to this fingerprint
//     const [candidateRows] = await pool.query(
//       `SELECT candidateId, name FROM Candidate WHERE fingerPrintID = ? AND isActive = 1`,
//       [fingerPrintID]
//     );

//     if (candidateRows.length === 0) {
//       return res.status(404).json("No active candidate linked to this fingerprint");
//     }

//     const candidateId = candidateRows[0].candidateId;

//     // 2. Check if attendance already exists today
//     const [attendanceRows] = await pool.query(
//       `SELECT * FROM Attendance WHERE candidateId = ? AND attendanceDate = CURDATE()`,
//       [candidateId]
//     );

//     if (attendanceRows.length > 0) {
//       return res.status(200).json("Attendance already marked for today");
//     }

//     // 3. Insert new attendance
//     await pool.query(
//       `INSERT INTO Attendance (candidateId, attendanceDate, inTime, createdAt) VALUES (?, CURDATE(), CURTIME(), NOW())`,
//       [candidateId]
//     );

//     return res.status(200).json("Attendance marked successfully");
//   } catch (error) {
//     console.error("❌ Error in VerifyAttendanceByFingerprintId:", error);
//     return res.status(500).json("Internal Server Error");
//   }
// });











console.log("✅ attendance.routes.js loaded");

router.post("/VerifyAttendanceByCandidateId", exports.verifyAttendanceByCandidateId);

module.exports = router;

































router.post("/VerifyAttendanceByFingerprintId", async (req, res) => {
  const { fingerPrintID } = req.body;

  if (!fingerPrintID) {
    return res.status(400).json({ error: "fingerPrintID is required" });
  }

  try {
    // Step 1: Find active candidate linked to fingerprint
    const [candidateRows] = await pool.query(
      `SELECT candidateId, name, toDate, balanceAmount FROM Candidate 
       WHERE fingerPrintID = ? AND isActive = 1`,
      [fingerPrintID]
    );

    if (candidateRows.length == 0) {
      port.write("BUZZ_ON\n");
      console.log("Buzz_on");
      return res.status(404).json({ error: "Candidate not found or inactive" });
    }

    const candidate = candidateRows[0];
    const today = new Date();
    const candidateToDate = new Date(candidate.toDate);
    const balance = parseFloat(candidate.balanceAmount || 0);

    // Check validity
    const isValid = balance > 0 && today <= candidateToDate;

    if (!isValid) {
      port.write("BUZZ_ON\n");
      return res.status(200).json({ message: "Candidate package expired or insufficient balance" });
    }

    // Step 2: Check if attendance is already marked today
    const [attendanceRows] = await pool.query(
      `SELECT * FROM Attendance 
       WHERE candidateId = ? AND attendanceDate = CURDATE()`,
      [candidate.candidateId]
    );

    if (attendanceRows.length > 0) {
      port.write("BUZZ_ON\n"); // Still buzz to show interaction
      return res.status(200).json({ message: "Attendance already marked for today" });
    }

    // Step 3: Mark attendance
    await pool.query(
      `INSERT INTO Attendance (candidateId, attendanceDate, inTime, createdAt) 
       VALUES (?, CURDATE(), CURTIME(), NOW())`,
      [candidate.candidateId]
    );

    port.write("BUZZ_OFF\n");
    console.log("Buzz_off")

    return res.status(200).json({ message: "Attendance marked successfully" });

  } catch (err) {
    console.error("❌ Error in VerifyAttendanceByFingerprintId:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});
