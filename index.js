const express = require("express");
const bodyParser=require("body-parser")
const app = express();
const cors = require("cors");
const fs=require("fs")
const nodemailer=require("nodemailer")
const db = require("./config/db.config");
db.connect();

const path = require("path");
const { webhookController } = require("./controllers/webhook.controller");
require("dotenv").config();

app.use(cors());
app.use("/api/v2/webhook", express.raw({ type: "*/*" }),webhookController);
app.use(express.json());

const DOWNLOAD_FOLDER = path.resolve(__dirname, 'downloads');

// Serve the downloaded files
app.use('/downloads', express.static(DOWNLOAD_FOLDER));

const PORT = 4000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("API LIVE!");
});

// Email send 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENT_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/clerk-webhook', (req, res) => {
    const event = req.body;

    if (event.type === 'user.created') {
        const user = event.data;
        if (user.email_addresses && user.email_addresses.length > 0) {
            userEmail = user.email_addresses[0].email_address;
        }
        console.log(`New user created: ${userEmail}`);

        const mailOptions = {
            from:process.env.SENT_EMAIL,
            to: userEmail,
            subject: 'Welcome to Our Website!',
            
            text: 'Thank you for signing up!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    res.sendStatus(200);
});


app.post('/send-email', (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from:'shubham.rajveer19@gmail.com' ,
        to: email,
        subject: 'Credit Limit Warning',
        text: 'Your credit balance is about to end. Please top up your credits.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent');
        }
    });
});

// make public a static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", require("./apis/v1/index"));
app.use("/api/v2", require("./apis/v2/index"));

app.listen(PORT, () => {
    console.log(`🌟 App live at http://localhost:${PORT}`);
});
