const { getResponse } = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");

const router = require("express").Router();

router.post("/", checkLimit ,getResponse);

module.exports = router;
