// routes/bio.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /Bio/GetAllcandidate
router.get("/GetAllcandidate", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM candidate");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

// GET /Bio/GetAlltrainer
router.get("/GetAlltrainer", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM trainer");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "Failed to fetch trainers" });
  }
});

// GET /Bio/GetAllpayment

router.get("/GetTotalPayment", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT SUM(amount) AS total_payment FROM payment");
    res.json({ total: rows[0].total_payment || 0 });
  } catch (error) {
    console.error("Error calculating total payment:", error);
    res.status(500).json({ message: "Failed to calculate total payment" });
  }
});


// GET /Bio/GetTotalPaymentLastMonth
router.get("/GetTotalPaymentLastMonth", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT IFNULL(SUM(paymentAmount), 0) AS total_payment
      FROM payment
      WHERE 
        MONTH(createdDate) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
        AND YEAR(createdDate) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
    `);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error calculating total payment:", error);
    res.status(500).json({ message: "Failed to calculate total payment" });
  }
});

// GET /Bio/GetTotalPaymentCurrentMonth
router.get("/GetTotalPaymentCurrentMonth", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT IFNULL(SUM(paymentAmount), 0) AS total_payment
      FROM payment
      WHERE 
        MONTH(createdDate) = MONTH(CURRENT_DATE)
        AND YEAR(createdDate) = YEAR(CURRENT_DATE)
    `);
    
    res.json({ total_payment: rows[0].total_payment });
  } catch (error) {
    console.error("Error calculating current month total payment:", error);
    res.status(500).json({ message: "Failed to calculate total payment" });
  }
});





module.exports = router;
