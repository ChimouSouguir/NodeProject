
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require('cors');


const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/send-email", (req, res) => {
  console.log("Received email request:", req.body);
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: error.toString() });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent: " + info.response });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
