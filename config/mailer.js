const nodemailer = require('nodemailer');

console.log("Loaded SMTP_EMAIL:", process.env.SMTP_EMAIL);
console.log("Loaded SMTP_PASSWORD:", process.env.SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Optional: verify transporter at startup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Email config error:', err);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"CleanUPHub" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
