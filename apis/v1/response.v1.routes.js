const { getResponse, getParaPhrase, getImage } = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");

const router = require("express").Router();

router.post("/", checkLimit, getResponse);
router.post("/paraphrase", checkLimit, getParaPhrase);
router.post("/image", checkLimit, getImage);

module.exports = router;
