// utils/arduino.js
const axios = require("axios");

async function sendCommandToArduino(command) {
  try {
    await axios.post("http://localhost:5000/arduino-command", { command });
    console.log("✅ Arduino Command Sent:", command);
  } catch (err) {
    console.error("❌ Failed to send command to Arduino:", err.message);
  }
}

module.exports = { sendCommandToArduino };
