// utils/sendMail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "murugatarun9787@gmail.com",     // your admin email
    pass: "jafb gicm wjpv kpmq", // use App Password or SMTP password
  },
});

const sendMail = async (subject, text) => {
  try {
    await transporter.sendMail({
      from: 'murugatarun9787@gmail.com',
      to: "tarunsivakumar03@gmail.com", // 👈 Replace with actual admin email
      subject,
      text,
    });
    console.log("✅ Mail sent to admin");
  } catch (error) {
    console.error("❌ Mail error:", error);
  }
};

module.exports = sendMail;







// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.ADMIN_EMAIL,     // ✅ Store sensitive info in .env
//     pass: process.env.ADMIN_EMAIL_PASS,
//   },
// });

// /**
//  * Sends an email to the admin
//  * @param {string} subject - Email subject
//  * @param {string} text - Plain text email body
//  */
// const sendMail = async (subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: `"Training App" <${process.env.ADMIN_EMAIL}>`,
//       to: process.env.ADMIN_RECEIVER_EMAIL, // ✅ Configurable target
//       subject,
//       text,
//     });
//     console.log("✅ Mail sent to admin");
//   } catch (error) {
//     console.error("❌ Mail error:", error.message);
//   }
// };

// module.exports = sendMail;
