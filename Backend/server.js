const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();


const trainerRoutes = require("./routes/trainer.routes");
const candidateRoutes = require("./routes/candidate.routes");
const servicePackageRoutes = require("./routes/service.routes"); // <== Add this
const fingerprintRoutes = require("./routes/fingerprint.routes");
const paymentRoutes = require("./routes/payment.routes");
const reportRoutes = require("./routes/report.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const trainerdashboardRoutes = require("./routes/trainerdashboard.routes");

// const { initializeSerialPort  } = require("./utils/serial");
// initializeSerialPort ();


app.use(cors({
  origin: 'http://localhost:7080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

app.use("/", require("./routes/auth"));
app.use("/Bio", trainerRoutes);
app.use("/Bio", candidateRoutes);
app.use("/Bio", servicePackageRoutes); // 👈 Register Service + Package routes here
app.use("/Bio", fingerprintRoutes);
app.use("/Bio", paymentRoutes);
app.use("/Bio", reportRoutes);
app.use("/Bio", attendanceRoutes);
app.use("/Bio", dashboardRoutes);
app.use("/Bio", trainerdashboardRoutes);

const PORT = process.env.PORT || 7081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// initializeSerialPort().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// });