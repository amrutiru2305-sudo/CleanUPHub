require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.sendMail({
  from: `"CleanUPHub" <${process.env.SMTP_EMAIL}>`,
  to: "yourpersonalemail@gmail.com",  // Replace with your email
  subject: "Test Email",
  text: "This is a test email from CleanUPHub project",
}, (error, info) => {
  if (error) {
    return console.log("❌ Failed:", error);
  }
  console.log("✅ Sent:", info.response);
});
