const router = require("express").Router();

const objectsRoutes = require("./objects.v2.routes");
const paymentRoutes = require("./payment.v2.routes");
const limitsRoutes = require("./limit.v2.routes");
const userRoutes = require("./user.v2.routes");
const plansRoutes = require("./plans.v2.routes");
const adminRoutes = require("./admin.v2.routes");
const { auth } = require("../../middleware/auth.middleware");
const { webhookController } = require("../../controllers/webhook.controller");
<<<<<<< HEAD
const Razorpay=require("../v2/RazorPayv2.routes")
const Razorpaycallback=require("./RzpcallBack.routes")
=======

>>>>>>> b771cc896ca4cdc8801940e1f4230867b1df4b45
router.get("/", (req, res) => {
    res.send("API LIVE!");
});

router.use("/objects", objectsRoutes);
router.use("/payment", auth, paymentRoutes);
router.use("/limits", auth, limitsRoutes);
router.use("/user", auth, userRoutes);
router.use("/plans", auth, plansRoutes);
router.use("/admin", adminRoutes);
<<<<<<< HEAD
router.use("/Razorpay", auth,Razorpay)
router.use("/verify", Razorpaycallback)
=======
>>>>>>> b771cc896ca4cdc8801940e1f4230867b1df4b45
// router.post("/webhook", webhookController);

module.exports = router;
