// const express = require("express");
// const router = express.Router();
// const db = require("../db"); // Your DB connection
// const sendMail = require("../utils/sendMail"); // Add at top

// // Get all payments
// router.get("/GetAllpayment", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM Payment ORDER BY createdDate DESC");
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add new payment
// // POST Add payment and update candidate balance
// // Add new payment with auto-calculated balanceAmount
// router.post("/Addpayment", async (req, res) => {
//   const {
//     CandidateId,
//     ServiceId,
//     PaymentAmount,
//     Paymentmode,
//     collectedby,
//     CreatedDate,
//     UpdatedDate,
//   } = req.body;

//   const sessionId = req.headers["x-session-id"] || "unknown";

//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();

//     // 1. Fetch candidate balance and name
//     const [candidateRows] = await connection.query(
//       "SELECT name, balanceAmount FROM Candidate WHERE candidateId = ?",
//       [CandidateId]
//     );

//     if (candidateRows.length === 0) {
//       throw new Error("Candidate not found");
//     }

//     const currentBalance = candidateRows[0].balanceAmount || 0;
//     const updatedBalance = currentBalance - PaymentAmount;
//     const name = candidateRows[0].name;

//     // 2. Insert payment record
//     await connection.query(
//       `INSERT INTO Payment (
//         candidateId, name, serviceId, balanceAmount,
//         paymentAmount, paymentmode, collectedby,
//         createdDate, updatedDate, sessionId, paymentReceiptNo
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         CandidateId,
//         name,
//         ServiceId,
//         updatedBalance,
//         PaymentAmount,
//         Paymentmode,
//         collectedby,
//         CreatedDate,
//         UpdatedDate,
//         sessionId,
//         `RCPT-${Date.now()}`
//       ]
//     );

//     // 3. Update candidate balance
//     await connection.query(
//       `UPDATE Candidate SET balanceAmount = ? WHERE candidateId = ?`,
//       [updatedBalance, CandidateId]
//     );

//     // 4. If balance is 0, update paymentStatus to "Completed"
//     if (updatedBalance <= 0) {
//       await connection.query(
//         `UPDATE Candidate SET paymentStatus = 'Completed' WHERE candidateId = ?`,
//         [CandidateId]
//       );
//     }

//     await connection.commit();
//     res.json({ success: true, message: "Payment recorded, balance and status updated." });
//   } catch (err) {
//     await connection.rollback();
//     res.status(500).json({ error: err.message });
//   } finally {
//     connection.release();
//   }
// });

// // Get candidate by ID
// router.get("/GetAllcandidatebyID", async (req, res) => {
//   const { id } = req.query;

//   if (!id) return res.status(400).json({ error: "Candidate ID is required" });

//   try {
//     const [rows] = await db.query("SELECT * FROM Candidate WHERE candidateId = ?", [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get service by ID
// router.get("/GetbyidServicetable", async (req, res) => {
//   const { id } = req.query;

//   if (!id) return res.status(400).json({ error: "Service ID is required" });

//   try {
//     const [rows] = await db.query("SELECT * FROM Service WHERE serviceId = ?", [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Service not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");
const sendMail = require("../utils/sendMail");
const { sendPaymentNotificationToAdmin } = require("../utils/sendMail");

// ------------------------- GET All Payments ------------------------- //
router.get("/GetAllpayment", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Payment ORDER BY createdDate DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------- Add Payment ------------------------- //
// router.post("/Addpayment", async (req, res) => {
//   const {
//     CandidateId,
//     Name,
//     ServiceId,
//     BalanceAmount,
//     PaymentAmount,
//     Paymentmode,
//     collectedby,
//     CreatedDate,
//     UpdatedDate,
//   } = req.body;

//   const role = req.headers["role"]; // ✅ Get role from frontend headers
//   const sessionId = req.headers["x-session-id"] || "unknown";
//   const paymentReceiptNo = `RCPT-${Date.now()}`;
//   const updatedBalance = BalanceAmount - PaymentAmount;

//   // Input validation
//   if (
//     !CandidateId ||
//     !Name ||
//     !ServiceId ||
//     !BalanceAmount ||
//     !PaymentAmount ||
//     !Paymentmode ||
//     !collectedby ||
//     !CreatedDate ||
//     !UpdatedDate
//   ) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     // Insert payment
//     await connection.query(
//       `INSERT INTO Payment (
//         candidateId, name, serviceId, balanceAmount,
//         paymentAmount, paymentmode, collectedby,
//         createdDate, updatedDate, sessionId, paymentReceiptNo
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         CandidateId,
//         Name,
//         ServiceId,
//         updatedBalance,
//         PaymentAmount,
//         Paymentmode,
//         collectedby,
//         CreatedDate,
//         UpdatedDate,
//         sessionId,
//         paymentReceiptNo,
//       ]
//     );

//     // Update candidate balance
//     await connection.query(
//       `UPDATE Candidate SET balanceAmount = ? WHERE candidateId = ?`,
//       [updatedBalance, CandidateId]
//     );

//     // If balance cleared, update paymentStatus
//     if (updatedBalance <= 0) {
//       await connection.query(
//         `UPDATE Candidate SET paymentStatus = 'Completed' WHERE candidateId = ?`,
//         [CandidateId]
//       );
//     }

//     await connection.commit();

//     // ✅ Send Email if role is trainer
//     if (role?.toLowerCase() === "trainer") {
//       try {
//         await sendPaymentNotificationToAdmin(collectedby);
//       } catch (mailErr) {
//         console.warn("Failed to send login notification:", mailErr.message);
//       }
//     }

//     res.status(200).json({ message: "Payment added successfully." });
//   } catch (err) {
//     await connection.rollback();
//     console.error("❌ Addpayment Error:", err);
//     res.status(500).json({ error: "Failed to add payment." });
//   } finally {
//     connection.release();
//   }
// });

router.post("/AddPayment", async (req, res) => {
  const {
    CandidateId,
    PaymentAmount,
    Paymentmode,
    collectedby,
    CreatedDate,
    UpdatedDate,
  } = req.body;

  const role = req.headers["role"];
  const sessionId = req.headers["x-session-id"] || "unknown";
  const paymentReceiptNo = `RCPT-${Date.now()}`;

  if (
    !CandidateId ||
    !PaymentAmount ||
    !Paymentmode ||
    !collectedby ||
    !CreatedDate ||
    !UpdatedDate
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 🔍 Get candidate details
    const [candidateRows] = await connection.query(
      `SELECT name, serviceId, balanceAmount FROM Candidate WHERE candidateId = ?`,
      [CandidateId]
    );

    if (!candidateRows.length) {
      throw new Error("Candidate not found");
    }

    const { name, serviceId, balanceAmount } = candidateRows[0];
    const updatedBalance = balanceAmount - PaymentAmount;

    // 💾 Insert payment
    await connection.query(
      `INSERT INTO Payment (
        candidateId, name, serviceId, balanceAmount,
        paymentAmount, paymentmode, collectedby,
        createdDate, updatedDate, sessionId, paymentReceiptNo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        CandidateId,
        name,
        serviceId,
        updatedBalance,
        PaymentAmount,
        Paymentmode,
        collectedby,
        CreatedDate,
        UpdatedDate,
        sessionId,
        paymentReceiptNo,
      ]
    );

    // 🔁 Update candidate balance and status
    await connection.query(
      `UPDATE Candidate SET balanceAmount = ? WHERE candidateId = ?`,
      [updatedBalance, CandidateId]
    );

    if (updatedBalance <= 0) {
      await connection.query(
        `UPDATE Candidate SET paymentStatus = 'Completed' WHERE candidateId = ?`,
        [CandidateId]
      );
    }

    await connection.commit();

    // 📧 Send Email to Admin if role is trainer
    if (role?.toLowerCase() === "trainer") {
      try {
        await sendPaymentNotificationToAdmin({
          candidateId: CandidateId,
          name,
          serviceId,
          balanceAmount: updatedBalance,
          paymentAmount: PaymentAmount,
          paymentmode: Paymentmode,
          collectedby,
        });
      } catch (mailErr) {
        console.warn("Failed to send payment notification:", mailErr.message);
      }
    }

    res.status(200).json({ message: "Payment added successfully." });
  } catch (err) {
    await connection.rollback();
    console.error("❌ AddPayment Error:", err);
    res.status(500).json({ error: "Failed to add payment." });
  } finally {
    connection.release();
  }
});

// ------------------------- Get Candidate by ID ------------------------- //
router.get("/GetAllcandidatebyID", async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Candidate ID is required" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM Candidate WHERE candidateId = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------- Get Service by ID ------------------------- //
router.get("/GetbyidServicetable", async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Service ID is required" });

  try {
    const [rows] = await db.query("SELECT * FROM Service WHERE serviceId = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------- Test Mail ------------------------- //
router.get("/TestMail", async (req, res) => {
  try {
    const subject = "✅ Test Mail from Node.js";
    const htmlBody = `
      <h3>This is a test email</h3>
      <p>If you're seeing this, the email system is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    `;

    await sendMail(subject, htmlBody);

    res.status(200).json({ message: "Test email sent successfully." });
  } catch (error) {
    console.error("❌ TestMail Error:", error.message);
    res.status(500).json({ error: "Failed to send test email." });
  }
});

module.exports = router;
