const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require("cors");
require('dotenv').config();

// middleware =====
app.use(express.json());
app.use(cors());

// nodemailer transporter set up ======
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      pass: process.env.WORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
   });


// transporter verification ======
transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});


// send email through transporter  using post route=====
app.post("/send", function (req, res) {
    console.log(req.body);
    let mailOptions = {
        to: process.env.EMAIL,
        subject: `${req.body.mailerState.subject} / ${req.body.mailerState.email}`,
        text: `${req.body.mailerState.message}`,
    };

   
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        res.json({
            status: "fail",
        });
      } else {
        console.log("== Message Sent ==");
        res.json({ 
            status: "success", 
        });
      }
    });
   });

const port = 3001;
app.listen(port, () => {
    console.log('Server is running on port:', port);
})