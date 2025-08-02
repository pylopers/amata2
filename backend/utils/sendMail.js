// utils/sendMail.js
import nodemailer from 'nodemailer';

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 465, // or 587
  secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
