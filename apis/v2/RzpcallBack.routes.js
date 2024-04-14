const router = require('express').Router();

const verifyOrder=require("../../controllers/rzpCallback.controller");

router.post("/payment-verification", verifyOrder.callBackApi)


module.exports = router;
