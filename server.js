const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;  // Default port to 3000 if not specified

app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter setup for Ethereal
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring the mail transporter:', error);
  } else {
    console.log('Mail transporter configured successfully:', success);
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, subject, phone, message } = req.body;

  if (!name || !email || !subject || !phone || !message) {
    return res.status(400).send('All fields are required');
  }

  const mailOptions = {
    from: email,
    to: process.env.SMTP_MAIL,
    subject: `New Message: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    } else {
      // console.log('Email sent:', info.response);
      return res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
