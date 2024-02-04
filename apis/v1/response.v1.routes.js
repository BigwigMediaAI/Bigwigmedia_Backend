const { getResponse, getParaPhrase } = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");

const router = require("express").Router();

router.post("/", checkLimit, getResponse);
router.post("/paraphrase", checkLimit, getParaPhrase);

module.exports = router;
