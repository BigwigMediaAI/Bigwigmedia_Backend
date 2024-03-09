const router = require("express").Router();

const objectsRoutes = require("./objects.v2.routes");
const paymentRoutes = require("./payment.v2.routes");
const limitsRoutes = require("./limit.v2.routes");
const userRoutes = require("./user.v2.routes");
const plansRoutes = require("./plans.v2.routes");
const adminRoutes = require("./admin.v2.routes");
const { auth } = require("../../middleware/auth.middleware");
const { webhookController } = require("../../controllers/webhook.controller");

router.get("/", (req, res) => {
    res.send("API LIVE!");
});

router.use("/objects", objectsRoutes);
router.use("/payment", auth, paymentRoutes);
router.use("/limits", auth, limitsRoutes);
router.use("/user", userRoutes);
router.use("/plans", auth, plansRoutes);
router.use("/admin", adminRoutes);
// router.post("/webhook", webhookController);

module.exports = router;
