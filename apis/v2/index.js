const router = require("express").Router();

const objectsRoutes = require("./objects.v2.routes");
const paymentRoutes = require("./payment.v2.routes");

router.get("/", (req, res) => {
    res.send("API LIVE!");
});

router.use("/objects", objectsRoutes);
router.use("/payment", paymentRoutes);


module.exports = router;
