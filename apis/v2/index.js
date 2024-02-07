const router = require("express").Router();

const objectsRoutes = require("./objects.v2.routes");

router.get("/", (req, res) => {
    res.send("API LIVE!");
});

router.use("/objects", objectsRoutes);


module.exports = router;
