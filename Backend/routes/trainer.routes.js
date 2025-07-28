// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // Get all trainers
// router.get("/GetAlltrainer", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM Trainer");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add or update trainer
// router.post("/AddOrUpdateTrainer", async (req, res) => {
//   const t = req.body;

//   try {
//     if (t.trainerId) {
//       // Update
//       await db.query(
//         `
//         UPDATE Trainer SET 
//           password = ?, name = ?, mobileNumber = ?, age = ?, 
//           address = ?, joiningDate = ?, isActive = ?, 
//           fingerPrintID = ?, branchId = ? 
//         WHERE trainerId = ?
//       `,
//         [
//           t.password,
//           t.name,
//           t.mobileNumber,
//           t.age,
//           t.address,
//           t.joiningDate,
//           t.isActive,
//           t.fingerPrintID,
//           t.branchId,
//           t.trainerId,
//         ]
//       );
//     } else {
//       // Insert
//       await db.query(
//         `
//         INSERT INTO Trainer (password, name, mobileNumber, age, address, joiningDate, isActive, fingerPrintID, branchId)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//         [
//           t.password,
//           t.name,
//           t.mobileNumber,
//           t.age,
//           t.address,
//           t.joiningDate,
//           t.isActive,
//           t.fingerPrintID,
//           t.branchId,
//         ]
//       );
//     }

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// module.exports = router;


































const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper to format date as YYYY-MM-DD (for MySQL DATE format)
const formatDateOnly = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

// Get all trainers
router.get("/GetAlltrainer", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Trainer");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update trainer
router.post("/AddOrUpdateTrainer", async (req, res) => {
  const t = req.body;

  try {
    const formattedJoiningDate = formatDateOnly(t.joiningDate);
    const formattedCreatedDate = formatDateOnly(t.createdDate || new Date());

    if (t.trainerId) {
      // Update existing trainer
      await db.query(
        `UPDATE Trainer SET 
          password = ?, name = ?, mobileNumber = ?, age = ?, 
          address = ?, joiningDate = ?, isActive = ?, 
          fingerPrintID = ?, branchId = ?
        WHERE trainerId = ?`,
        [
          t.password,
          t.name,
          t.mobileNumber,
          t.age,
          t.address,
          formattedJoiningDate,
          t.isActive,
          t.fingerPrintID,
          t.branchId,
          t.trainerId,
        ]
      );
    } else {
      // Insert new trainer
      await db.query(
        `INSERT INTO Trainer 
          (password, name, mobileNumber, age, address, joiningDate, isActive, fingerPrintID, branchId, createdDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.password,
          t.name,
          t.mobileNumber,
          t.age,
          t.address,
          formattedJoiningDate,
          t.isActive,
          t.fingerPrintID,
          t.branchId,
          formattedCreatedDate,
        ]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
