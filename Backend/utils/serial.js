// const { SerialPort } = require("serialport");
// const { ReadlineParser } = require("@serialport/parser-readline");

// let port = null;
// let parser = null;

// async function setupSerial() {
//   try {
//     // Get all available ports
//     const ports = await SerialPort.list();

//     // Try to find a port that looks like an Arduino
//     const arduinoPort = ports.find((p) =>
//       p.manufacturer && p.manufacturer.toLowerCase().includes("arduino")
//     );

//     // Fallback: pick the first available port
//     const selectedPort = arduinoPort || ports[0];

//     if (!selectedPort) {
//       console.log("❌ No serial ports found.");
//       return;
//     }

//     console.log(`✅ Using serial port: ${selectedPort.path}`);

//     port = new SerialPort({
//       path: selectedPort.path,
//       baudRate: 9600,
//     });

//     parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

//     port.on("open", () => {
//       console.log("✅ Serial Port Opened at", selectedPort.path);
//     });

//     port.on("error", (err) => {
//       console.error("💥 Serial Port Error:", err.message);
//     });

//     parser.on("data", (data) => {
//       console.log("📩 From Arduino:", data.trim());
//     });

//   } catch (error) {
//     console.error("❌ Failed to setup serial port:", error);
//   }
// }

// // Function to send data to Arduino
// function sendToArduino(message) {
//   if (port && port.isOpen) {
//     port.write(message + "\n", (err) => {
//       if (err) console.error("⚠️ Error sending to Arduino:", err.message);
//       else console.log("➡️ Sent to Arduino:", message);
//     });
//   } else {
//     console.warn("⚠️ Serial port not open. Cannot send:", message);
//   }
// }

// module.exports = {
//   setupSerial,
//   sendToArduino,
// };


























// serial.js
const { SerialPort } = require("serialport");

let serialPort;

async function initializeSerialPort() {
  const ports = await SerialPort.list();

  const selectedPort = ports.find(port =>
    port.manufacturer?.toLowerCase().includes("arduino") ||
    port.manufacturer?.toLowerCase().includes("wch") ||
    port.path.toLowerCase().includes("com")
  );

  if (!selectedPort) {
    console.error("❌ No valid serial port found.");
    return null;
  }

  serialPort = new SerialPort({
    path: selectedPort.path,
    baudRate: 9600,
    autoOpen: true,
  });

  serialPort.on("open", () => {
    console.log(`✅ Serial Port Opened at ${selectedPort.path}`);
  });

  serialPort.on("error", err => {
    console.error("Serial Port Error:", err.message);
  });

  return serialPort;
}

function getSerialPort() {
  return serialPort;
}

module.exports = { initializeSerialPort, getSerialPort };
