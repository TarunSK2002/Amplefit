// utils/serial.js
const { SerialPort } = require("serialport");

async function listAvailablePorts() {
  try {
    const ports = await SerialPort.list();

    console.log("🔌 Available Serial Ports:");
    ports.forEach((port, index) => {
      console.log(`${index + 1}. ${port.path}`);
      console.log(`   Manufacturer: ${port.manufacturer}`);
      console.log(`   Serial Number: ${port.serialNumber}`);
      console.log(`   PnP ID: ${port.pnpId}`);
      console.log(`   Friendly Name: ${port.friendlyName}`);
      console.log(`   -----------------------------------`);
    });

    return ports;
  } catch (err) {
    console.error("❌ Error listing ports:", err.message);
    return [];
  }
}

async function openArduinoPort() {
  const ports = await listAvailablePorts();

  const arduinoPortInfo = ports.find(
    (port) =>
      port.path.includes("COM") &&
      (port.manufacturer?.toLowerCase().includes("arduino") ||
        port.friendlyName?.toLowerCase().includes("wch") ||
        port.vendorId || port.productId) // broaden match
  );

  if (!arduinoPortInfo) {
    throw new Error("❌ No Arduino-compatible device found.");
  }

  const port = new SerialPort({
    path: arduinoPortInfo.path,
    baudRate: 9600,
    autoOpen: true,
  });

  port.on("open", () => {
    console.log(`✅ Serial Port Opened at ${arduinoPortInfo.path}`);
  });

  port.on("error", (err) => {
    console.error("❌ Serial Port Error:", err.message);
  });

  return port;
}

module.exports = { listAvailablePorts, openArduinoPort };


















// const { SerialPort } = require("serialport");

// let serialPort;

// async function initializeSerialPort() {
//   const ports = await SerialPort.list();

//   console.log("🔌 Available Ports:", ports.map(p => `${p.path} - ${p.manufacturer || "unknown"}`));

//   const selectedPort = ports.find(port =>
//     (port.manufacturer && port.manufacturer.toLowerCase().includes("wch")) || // Matches "wch.cn"
//     (port.path && port.path.toLowerCase().includes("com7"))                   // Optional: hardcode COM7 as fallback
//   );

//   if (!selectedPort) {
//     console.error("❌ No valid serial port found.");
//     return null;
//   }

//   serialPort = new SerialPort({
//     path: selectedPort.path,
//     baudRate: 9600,
//     autoOpen: true,
//   });

  // serialPort.on("open", () => {
  //   console.log(`✅ Serial Port Opened at ${selectedPort.path}`);
  //   if (serialPort && serialPort.isOpen) {
  // console.log("⚠️ Serial port already open.");
  // return serialPort;
// }

//   });

//   serialPort.on("error", err => {
//     console.error("❌ Serial Port Error:", err.message);
//   });

//   return serialPort;
// }
  
// function getSerialPort() {
//   return serialPort;
// }

// module.exports = { initializeSerialPort, getSerialPort };
