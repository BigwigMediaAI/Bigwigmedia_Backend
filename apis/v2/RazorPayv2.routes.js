const router = require('express').Router();

const Raxozpay_Controller=require("../../controllers/RazorPay.controller")
router.post('/order', Raxozpay_Controller.createOrder);



module.exports = router;
