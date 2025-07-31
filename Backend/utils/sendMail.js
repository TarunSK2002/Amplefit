

const nodemailer = require("nodemailer");

// Configure transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "amplefit2802@gmail.com",
    pass: "xefo mwae zqqb fziy", // App password
  },
});

const ADMIN_EMAIL = "tarunsivakumar03@gmail.com";

// 1. Trainer Login Notification
const sendLoginNotificationToAdmin = async (login) => {
  try {
    const mailOptions = {
      from: '"GymManagement" <amplefit2802@gmail.com>',
      to: ADMIN_EMAIL,
      subject: "Trainer Login Notification",
      html: `
        <h2>Trainer Login Alert 🚨</h2>
        <p><strong>Trainer Name:</strong> ${login.userName}</p>
        <p><strong>Login ID:</strong> ${login.LoginId}</p>
        <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Login email sent to admin.");
  } catch (err) {
    console.error("❌ Login Email Error:", err);
  }
};

// 2. Candidate Enrollment Notification
const sendCandidateEnrollmentNotification = async (candidate) => {
  try {
    const mailOptions = {
      from: '"GymManagement" <amplefit2802@gmail.com>',
      to: ADMIN_EMAIL,
      subject: "New Candidate Enrolled by Trainer",
      html: `
        <h2>🎉 New Candidate Enrollment</h2>
        <p><strong>Name:</strong> ${candidate.name}</p>
        <p><strong>Mobile:</strong> ${candidate.mobileNumber}</p>
        <p><strong>Enrolled By:</strong> $  {collectedBy}</p>
        <p><strong>Date of Joining:</strong> ${candidate.doj}</p>
        <p><strong>Package:</strong> ${candidate.packageName} - ₹${
        candidate.packageAmount
      }</p>
        <p><strong>Branch:</strong> ${candidate.branchName}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Candidate enrollment email sent.");
  } catch (err) {
    console.error("❌ Enrollment Email Error:", err);
  }
};

// 3. Payment Collection Notification

const sendPaymentNotificationToAdmin = async (payment) => {
  try {
    const mailOptions = {
      from: '"GymManagement" <amplefit2802@gmail.com>',
      to: ADMIN_EMAIL,
      subject: "Payment Collected by Trainer 💰",
      html: `
        <h2>Payment Collected</h2>
        <p><strong>Candidate Name:</strong> ${payment.name}</p>
        <p><strong>Candidate ID:</strong> ${payment.candidateId}</p>
        <p><strong>Amount Paid:</strong> ₹${payment.paymentAmount}</p>
        <p><strong>Payment Mode:</strong> ${payment.paymentmode}</p>
        <p><strong>Collected By:</strong> ${payment.collectedby}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // ✅ Correct log with destructured fields
    console.log({
      candidateId: payment.candidateId,
      name: payment.name,
      paymentAmount: payment.paymentAmount,
      paymentmode: payment.paymentmode,
      collectedby: payment.collectedby,
      role: payment.role || "trainer", // fallback to 'trainer' if undefined
    });

    console.log("📩 Payment email sent.");
  } catch (err) {
    console.error("❌ Payment Email Error:", err);
  }
};



// Export all functions
module.exports = {
  sendLoginNotificationToAdmin,
  sendCandidateEnrollmentNotification,
  sendPaymentNotificationToAdmin,
};

