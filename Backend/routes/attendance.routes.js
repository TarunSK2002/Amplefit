
const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const https = require("https");
const { SerialPort } = require("serialport");

// ⏬ Helper to find and open Arduino Serial Port
let serialPort = null;

async function openArduinoPort() {
  if (serialPort && serialPort.isOpen) {
    console.log("⚠️ Serial port already open.");
    return serialPort;
  }

  const ports = await SerialPort.list();

  // Show all ports for debug
  console.log("📜 Available Serial Ports:");
  ports.forEach((port, index) => {
    console.log(`${index + 1}. ${port.path}`);
    console.log(`   Manufacturer: ${port.manufacturer}`);
    console.log(`   Friendly Name: ${port.friendlyName}`);
    console.log(`   PnP ID: ${port.pnpId}`);
    console.log("-----------------------------------");
  });

  const arduinoPortInfo = ports.find(
    (port) =>
      (port.manufacturer && port.manufacturer.toLowerCase().includes("wch")) || // CH340
      (port.friendlyName &&
        port.friendlyName.toLowerCase().includes("ch340")) ||
      (port.pnpId && port.pnpId.toLowerCase().includes("vid_1a86&pid_7523"))
  );

  if (!arduinoPortInfo) {
    throw new Error("Arduino (CH340) not found.");
  }

  serialPort = new SerialPort({
    path: arduinoPortInfo.path,
    baudRate: 9600,
    autoOpen: false,
  });

  serialPort.open((err) => {
    if (err) {
      console.error(
        `❌ Error opening serial port (${arduinoPortInfo.path}):`,
        err.message
      );
    } else {
      console.log(`✅ Serial Port Opened at ${arduinoPortInfo.path}`);
    }
  });

  serialPort.on("error", (err) => {
    console.error("❌ Serial Port Error:", err.message);
  });

  return serialPort;
}

// ✅ GET all attendance
router.get("/GetAllAttendance", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.*, 
        c.name AS name,
        s.serviceName,
        p.packageName,
        b.branchName
      FROM Attendance a
      LEFT JOIN Candidate c ON a.candidateId = c.candidateId
      LEFT JOIN Service s ON c.serviceId = s.serviceId
      LEFT JOIN Package p ON c.packageId = p.packageId
      LEFT JOIN Branch b ON c.branchId = b.branchId
      ORDER BY a.attendanceDate DESC, a.inTime DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST to verify and mark attendance
router.post("/VerifyAttendanceByFingerprintTemplate", async (req, res) => {
  const { template } = req.body;
  const secugen_lic = "";

  if (!template) {
    return res.status(400).json({ error: "Fingerprint template is required" });
  }

  let port;
  try {
    port = await openArduinoPort();
  } catch (err) {
    console.error("❌ Serial Port Error:", err.message);
    return res.status(500).json({ error: "Arduino not connected" });
  }

  try {
    const [fingerprintRows] = await pool.query(`
      SELECT fingerPrintID, fingerPrint1, fingerPrint2, fingerPrint3
      FROM fingerprint
    `);

    for (const fp of fingerprintRows) {
      const templatesToCompare = [
        fp.fingerPrint1,
        fp.fingerPrint2,
        fp.fingerPrint3,
      ];

      for (const storedTemplate of templatesToCompare) {
        const params = `template1=${encodeURIComponent(
          template
        )}&template2=${encodeURIComponent(
          storedTemplate
        )}&licstr=${encodeURIComponent(secugen_lic)}&templateFormat=ISO`;

        const matchRes = await axios.post(
          "https://localhost:8000/SGIMatchScore",
          params,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }
        );

        const result = matchRes.data;

        if (result.ErrorCode === 0 && result.MatchingScore >= 140) {
          const [candidateRows] = await pool.query(
            `
            SELECT candidateId, name, toDate, balanceAmount, isActive
            FROM Candidate
            WHERE fingerPrintID = ? AND isActive = 1
          `,
            [fp.fingerPrintID]
          );

          if (candidateRows.length === 0) {
            return res
              .status(404)
              .json({ error: "Candidate not found or inactive" });
          }

          const candidate = candidateRows[0];
          const today = new Date();
          const toDate = new Date(candidate.toDate);
          const balance = parseFloat(candidate.balanceAmount || 0);
          const isValidDate = today <= toDate;

          if (balance === 0 && isValidDate) {
            const [attendanceRows] = await pool.query(
              `
              SELECT * FROM Attendance
              WHERE candidateId = ? AND attendanceDate = CURDATE()
            `,
              [candidate.candidateId]
            );

            if (attendanceRows.length > 0) {
              port.write("DUPLICATE\n");
              return res.status(200).json({
                message: "Attendance already marked today (buzz off)",
                candidate,
                score: result.MatchingScore,
              });
            }

            await pool.query(
              `
              INSERT INTO Attendance (candidateId, attendanceDate, inTime, createdAt)
              VALUES (?, CURDATE(), CURTIME(), NOW())
            `,
              [candidate.candidateId]
            );

            port.write("BUZZ_OFF\n");
            return res.status(200).json({
              message: "Attendance marked successfully (buzz off)",
              candidate,
              score: result.MatchingScore,
            });
            // CASE 2: balance > 0 and date valid ➜ mark attendance + buzz_on
          } else if (balance > 0 && isValidDate) {
            const [attendanceRows] = await pool.query(
              `
              SELECT * FROM Attendance
              WHERE candidateId = ? AND attendanceDate = CURDATE()
            `,
              [candidate.candidateId]
            );

            if (attendanceRows.length > 0) {
              port.write("DUPLICATE\n");
              return res
                .status(200)
                .json({ message: "Attendance already marked today (buzz on)" });
            }

            await pool.query(
              `
              INSERT INTO Attendance (candidateId, attendanceDate, inTime, createdAt)
              VALUES (?, CURDATE(), CURTIME(), NOW())
            `,
              [candidate.candidateId]
            );

            port.write("BUZZ_ON\n");
            return res.status(200).json({
              message: "Attendance marked successfully (buzz on)",
              candidate,
              score: result.MatchingScore,
            });

            // CASE 3: balance > 0 and date expired ➜ don't mark attendance + buzz_on
          } else if (balance > 0 && !isValidDate) {
            port.write("BUZZ_ON\n");
            return res.status(200).json({
              message: "Package expired — attendance not marked (buzz on)",
              candidate,
            });

            // CASE 4: balance = 0 and date expired ➜ do nothing
          } else {
            return res
              .status(200)
              .json({ message: "Package expired and balance = 0 — no action" });
          }
        }
      }
    }

    return res
      .status(404)
      .json({ match: false, message: "No matching fingerprint found" });
  } catch (err) {
    console.error("❌ Error verifying attendance:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = router;
