const express = require("express");
const bodyParser=require("body-parser")
const app = express();
const cors = require("cors");
const db = require("./config/db.config");
db.connect();

const path = require("path");
const { webhookController } = require("./controllers/webhook.controller");
require("dotenv").config();

// app.use(cors());
app.use("/api/v2/webhook", express.raw({ type: "*/*" }),webhookController);
app.use(express.json());

const allowedOrigins = ['http://localhost:5173'];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const PORT = 4000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("API LIVE!");
});

// make public a static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", require("./apis/v1/index"));
app.use("/api/v2", require("./apis/v2/index"));

app.listen(PORT, () => {
    console.log(`🌟 App live at http://localhost:${PORT}`);
});
