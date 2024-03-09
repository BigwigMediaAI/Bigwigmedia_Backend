const { getPaymentm,  } = require("../../controllers/payment.controller");

const router = require("express").Router();


router.post("/create-checkout-session", getPaymentm);
// router.post("/webhook", webhookController);


module.exports = router;