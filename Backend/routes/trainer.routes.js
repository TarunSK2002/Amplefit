const express = require("express");
const router = express.Router();
const db = require("../db");
const { sendLoginNotificationToAdmin } = require("../utils/sendMail");

// Helper to format date as YYYY-MM-DD
const formatDateOnly = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

// ✅ Get all trainers
router.get("/GetAlltrainer", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Trainer");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add or update trainer
router.post("/AddOrUpdateTrainer", async (req, res) => {
  const t = req.body;

  try {
    // Basic validation
    if (!t.name || !t.mobileNumber || !t.joiningDate || !t.branchId) {
      return res.status(400).json({ error: "Missing required trainer fields." });
    }

    const formattedJoiningDate = formatDateOnly(t.joiningDate);
    const formattedCreatedDate = formatDateOnly(t.createdDate || new Date());

    if (t.trainerId) {
      // ✅ Update existing trainer
      await db.query(
        `UPDATE Trainer SET 
          password = ?, name = ?, mobileNumber = ?, age = ?, 
          address = ?, joiningDate = ?, isActive = ?, 
          fingerPrintID = ?, branchId = ?
        WHERE trainerId = ?`,
        [
          t.password || null,
          t.name,
          t.mobileNumber,
          t.age || null,
          t.address || null,
          formattedJoiningDate,
          t.isActive ?? 1,
          t.fingerPrintID || null,
          t.branchId,
          t.trainerId,
        ]
      );

      res.json({ success: true, message: "Trainer updated successfully." });

    } else {
      // ✅ Insert new trainer
      const [result] = await db.query(
        `INSERT INTO Trainer 
          (password, name, mobileNumber, age, address, joiningDate, isActive, fingerPrintID, branchId, createdDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.password || null,
          t.name,
          t.mobileNumber,
          t.age || null,
          t.address || null,
          formattedJoiningDate,
          t.isActive ?? 1,
          t.fingerPrintID || null,
          t.branchId,
          formattedCreatedDate,
        ]
      );

      const trainerId = result.insertId;

      // ✅ Insert login credentials to login_auth
      const [authResult] = await db.query(
        `INSERT INTO login_auth (userName, password, role, createdAt)
         VALUES (?, ?, ?, ?)`,
        [
          t.name, // username as mobile number
          t.password || "1234", // fallback password
          "trainer", // role
          formattedCreatedDate,
        ]
      );

      // Optional: Notify admin
      // await sendLoginNotificationToAdmin(t.name, t.mobileNumber);

      res.json({
        success: true,
        trainerId,
        loginId: authResult.insertId,
        message: "Trainer added and login credentials stored successfully.",
      });
    }

  } catch (err) {
    console.error("AddOrUpdateTrainer Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



































// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const { sendLoginNotificationToAdmin } = require("../utils/sendMail");

// // Helper to format date as YYYY-MM-DD
// const formatDateOnly = (date) => {
//   return new Date(date).toISOString().split("T")[0];
// };

// // ✅ Get all trainers
// router.get("/GetAlltrainer", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM Trainer");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Add or update trainer
// router.post("/AddOrUpdateTrainer", async (req, res) => {
//   const t = req.body;

//   try {
//     // Basic validation
//     if (!t.name || !t.mobileNumber || !t.joiningDate || !t.branchId) {
//       return res.status(400).json({ error: "Missing required trainer fields." });
//     }

//     const formattedJoiningDate = formatDateOnly(t.joiningDate);
//     const formattedCreatedDate = formatDateOnly(t.createdDate || new Date());

//     if (t.trainerId) {
//       // ✅ Update existing trainer
//       await db.query(
//         `UPDATE Trainer SET 
//           password = ?, name = ?, mobileNumber = ?, age = ?, 
//           address = ?, joiningDate = ?, isActive = ?, 
//           fingerPrintID = ?, branchId = ?
//         WHERE trainerId = ?`,
//         [
//           t.password || null,
//           t.name,
//           t.mobileNumber,
//           t.age || null,
//           t.address || null,
//           formattedJoiningDate,
//           t.isActive ?? 1,
//           t.fingerPrintID || null,
//           t.branchId,
//           t.trainerId,
//         ]
//       );

//       res.json({ success: true, message: "Trainer updated successfully." });

//     } else {
//       // ✅ Insert new trainer
//       const [result] = await db.query(
//         `INSERT INTO Trainer 
//           (password, name, mobileNumber, age, address, joiningDate, isActive, fingerPrintID, branchId, createdDate)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           t.password || null,
//           t.name,
//           t.mobileNumber,
//           t.age || null,
//           t.address || null,
//           formattedJoiningDate,
//           t.isActive ?? 1,
//           t.fingerPrintID || null,
//           t.branchId,
//           formattedCreatedDate,
//         ]
//       );

//       // Optional: Notify admin about new trainer
//       // await sendLoginNotificationToAdmin(t.name, t.mobileNumber); 

//       res.json({ success: true, trainerId: result.insertId, message: "Trainer added successfully." });
//     }

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
