const express = require("express");
const router = express.Router();
const db = require("../db");
const { format } = require("date-fns");
const { sendCandidateEnrollmentNotification } = require("../utils/sendMail");
const formatDate = (dateStr) => {
  return format(new Date(dateStr), "yyyy-MM-dd"); // or your desired format
};

router.get("/GetAllcandidate", async (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const query = includeInactive
    ? "SELECT * FROM Candidate"
    : "SELECT * FROM Candidate WHERE isActive = 1";

  try {
    const [rows] = await db.query(query);
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
          createdDate,
          c.candidateId,
        ]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO Candidate (
          name, gender, address, mobileNumber, doj, 
          serviceId, packageId, branchId, packageMonths, packageAmount, 
          balanceAmount, fromDate, toDate, paymentStatus, 
          fingerPrintID, isActive, createdDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ); // Send notification email only for new candidate
      if (c.role === "trainer") {
        const [branch] = await db.query(
          "SELECT branchName FROM Branch WHERE branchId = ?",
          [c.branchId]
        );
        const [packageInfo] = await db.query(
          "SELECT packageName FROM Package WHERE packageId = ?",
          [c.packageId]
        );

        const enrichedCandidate = {
          name: c.name,
          mobileNumber: c.mobileNumber,
          createdBy: "Trainer", // or include trainerName if you want
          doj: formatDate(c.doj),
          packageName: packageInfo[0]?.packageName || "N/A",
          packageAmount: c.packageAmount,
          branchName: branch[0]?.branchName || "N/A",
        };

        await sendCandidateEnrollmentNotification(enrichedCandidate);
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // DELETE candidate by ID
// router.delete("/DeleteCandidate/:id", async (req, res) => {
//   const candidateId = req.params.id;

//   try {
//     const [result] = await db.query(
//       "DELETE FROM Candidate WHERE candidateId = ?",
//       [candidateId]
//     );

//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Candidate not found" });
//     }

//     res.json({ success: true, message: "Candidate deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // SOFT DELETE candidate by setting isActive = 0
// router.put("/DeleteCandidate/:id", async (req, res) => {
//   const candidateId = req.params.id;

//   try {
//     const [result] = await db.query(
//       "UPDATE Candidate SET isActive = 0 WHERE candidateId = ?",
//       [candidateId]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: "Candidate not found" });
//     }

//     res.json({ success: true, message: "Candidate marked as inactive (soft deleted)" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// DELETE /DeleteCandidate/:id
router.delete("/DeleteCandidate/:id", async (req, res) => {
  const candidateId = req.params.id;

  try {
    // Step 1: Delete from AttendanceTable
    await db.query("DELETE FROM attendance WHERE CandidateId = ?", [
      candidateId,
    ]);

    // Step 2: Delete from CandidateEnrollment
    await db.query("DELETE FROM candidate WHERE CandidateId = ?", [
      candidateId,
    ]);

    res
      .status(200)
      .json({
        message:
          "Candidate and related records deleted successfully (Payment retained).",
      });
  } catch (error) {
    console.error("❌ Deletion Error:", error);
    res
      .status(500)
      .json({ error: "Failed to delete candidate. See logs for more info." });
  }
});

module.exports = router;
