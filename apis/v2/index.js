const router = require("express").Router();

const objectsRoutes = require("./objects.v2.routes");
const paymentRoutes = require("./payment.v2.routes");
const limitsRoutes = require("./limit.v2.routes");
const userRoutes = require("./user.v2.routes");
const { auth } = require("../../middleware/auth.middleware");

router.get("/", (req, res) => {
    res.send("API LIVE!");
});

router.use("/objects", objectsRoutes);
router.use("/payment", paymentRoutes);
router.use("/limits", auth, limitsRoutes);
router.use("/user", userRoutes);

module.exports = router;
