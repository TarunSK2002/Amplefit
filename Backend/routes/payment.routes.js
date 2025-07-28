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
const db = require("../db"); // Your DB connection
const sendMail = require("../utils/sendMail"); // Mail utility

// Get all payments
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

// Add new payment
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
//         `RCPT-${Date.now()}`,
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

//     // ✅ Send mail to admin if collected by a trainer
//     if (collectedby && collectedby.toLowerCase().includes("trainer")) {
//       const emailSubject = "Trainer Payment Collection Alert";

//       const emailBody = `
//       A payment has been collected by a trainer.

//       Candidate ID  : ${CandidateId}
//       Candidate Name: ${name}
//       Service ID     : ${ServiceId}
//       Payment Amount : ₹${PaymentAmount}
//       Remaining Bal. : ₹${updatedBalance}
//       Payment Mode   : ${Paymentmode}
//       Collected By   : ${collectedby}
//       Date           : ${CreatedDate} `;

//       await sendMail(emailSubject, emailBody);
//     }

//     res.json({
//       success: true,
//       message: "Payment recorded, balance and status updated.",
//     });
//   } catch (err) {
//     await connection.rollback();
//     res.status(500).json({ error: err.message });
//   } finally {
//     connection.release();
//   }
// });

router.post("/Addpayment", async (req, res) => {
  const {
    CandidateId,
    Name,
    ServiceId,
    BalanceAmount,
    PaymentAmount,
    Paymentmode,
    collectedby,
    role,
    CreatedDate,
    UpdatedDate,
  } = req.body;

  const sessionId = req.headers["x-session-id"] || "unknown";
  const paymentReceiptNo = `RCPT-${Date.now()}`;
  const updatedBalance = BalanceAmount - PaymentAmount;

  if (
    !CandidateId ||
    !ServiceId ||
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

    // Insert into Payment
    await connection.query(
      `INSERT INTO Payment (
        candidateId, name, serviceId, balanceAmount,
        paymentAmount, paymentmode, collectedby,
        createdDate, updatedDate, sessionId, paymentReceiptNo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        CandidateId,
        Name,
        ServiceId,
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

    // Update candidate balance
    await connection.query(
      `UPDATE Candidate SET balanceAmount = ? WHERE candidateId = ?`,
      [updatedBalance, CandidateId]
    );

    // Mark payment as completed if balance is 0
    if (updatedBalance <= 0) {
      await connection.query(
        `UPDATE Candidate SET paymentStatus = 'Completed' WHERE candidateId = ?`,
        [CandidateId]
      );
    }

    await connection.commit();

    // ✅ Email Notification (only if trainer)
    if (role?.toLowerCase() === "trainer") {
      const emailSubject = `Trainer Payment Alert: ${collectedby}`;
      const emailBody = `
        <h3>Trainer Payment Notification</h3>
        <p>A payment was collected by a trainer.</p>
        <ul>
          <li><strong>Candidate ID:</strong> ${CandidateId}</li>
          <li><strong>Candidate Name:</strong> ${Name}</li>
          <li><strong>Service ID:</strong> ${ServiceId}</li>
          <li><strong>Amount Paid:</strong> ₹${PaymentAmount}</li>
          <li><strong>Remaining Balance:</strong> ₹${updatedBalance}</li>
          <li><strong>Payment Mode:</strong> ${Paymentmode}</li>
          <li><strong>Collected By:</strong> ${collectedby}</li>
          <li><strong>Date:</strong> ${CreatedDate}</li>
        </ul>
      `;

      await sendMail(emailSubject, emailBody);
    }

    res.status(200).json({ message: "Payment added successfully." });
  } catch (err) {
    await connection.rollback();
    console.error("Addpayment Error:", err);
    res.status(500).json({ error: "Failed to add payment." });
  } finally {
    connection.release();
  }
});

// Get candidate by ID
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

// Get service by ID
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

module.exports = router;
