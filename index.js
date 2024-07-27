const express = require("express");
const bodyParser=require("body-parser")
const app = express();
const cors = require("cors");
const fs=require("fs")
const nodemailer=require("nodemailer")
const db = require("./config/db.config");
const User = require("./models/users.models")
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = 4000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("API LIVE!");
});

// Onboard Email send 

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
            subject: 'Welcome to BigwigMedia.AI!',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h1>Welcome to Bigwigmedia.ai</h1>
                <img src="https://bigwigmedia.ai/assets/bigwig-img-pvLFkfcL.jpg" alt="Welcome Image" style="max-width: 25%; height: auto;" />
                <p>Dear ${user.first_name || 'User'},</p>
                <p>We're thrilled to have you join our community! At BigwigMedia.AI, we offer a variety of daily-use AI tools designed to make your life easier and more efficient. Whether you're looking to enhance your productivity, streamline your tasks, or simply explore the fascinating world of AI, we've got you covered.</p>
                <p>Dive in and start exploring all that BigwigMedia.AI has to offer. We're here to support you every step of the way, and we can't wait to see what you'll achieve with our tools.</p>
                <p>Thank you for choosing us, and welcome aboard!</p>
                <p>Warm regards,</p>
                <p>The BigwigMedia.AI Team</p>
            </div>
        `
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

// Credit Exhausted email sent

app.post('/send-email', async (req, res) => {
    const { email, clerkId } = req.body;

    try {
        // Fetch the user document
        const user = await User.findOne({ clerkId });
        // Check if emailSent is false
        if (!user.emailSent) {
            const mailOptions = {
                from: process.env.SENT_EMAIL,
                to: email,
                subject: `Urgent: Your BigwigMedia.AI Credits Have Been Exhausted`,
                html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <img src="https://bigwigmedia.ai/assets/bigwig-img-pvLFkfcL.jpg" alt="Welcome Image" style="max-width: 25%; height: auto;" />
                <p>Dear ${user.name || 'User'},</p>
                <p>We regret to inform you that your credits at BigwigMedia.AI have been exhausted. To continue enjoying uninterrupted access to all our features, you will need to add more credits to your account.</p>
                <p>To top up your credits, please log into your account and visit the profile section or <a href="https://bigwigmedia.ai/plan">click here</a>. If you have any questions or need assistance, our support team is ready to help.</p>
                <p>Thank you for being a valued member of BigwigMedia.AI. We appreciate your continued support.</p>
                <p>Best regards,</p>
                <p>The BigwigMedia.AI Team</p>
            </div>
            `
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Error sending email');
                }

                // Update the emailSent flag in the user's document
                user.emailSent = true;
                console.log(user.emailSent)
                await user.save();

                res.status(200).send('Email sent');
            });
        } else {
            console.log('Email already sent, not sending again.');
            res.status(200).send('Email already sent, not sending again.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error sending email');
    }
});

app.put('/reset-email-sent', async (req, res) => {
    const { clerkId } = req.body;

    try {
        const user = await User.findOne({ clerkId });

        if (user) {
            user.emailSent = false;
            await user.save();
            res.status(200).send(user.emailSent);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error processing request');
    }
});

// make public a static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", require("./apis/v1/index"));
app.use("/api/v2", require("./apis/v2/index"));

app.listen(PORT, () => {
    console.log(`🌟 App live at http://localhost:${PORT}`);
});
