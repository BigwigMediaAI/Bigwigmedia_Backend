const { getResponse, getParaPhrase, getImage ,getSpecialtool,getDecision,getSeo,resizeImage,getCodeConverter} = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");
const multer = require('multer');


const router = require("express").Router();
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

router.post("/", checkLimit, getResponse);
router.post("/paraphrase", checkLimit, getParaPhrase);
router.post("/image", checkLimit, getImage);
router.post("/special",checkLimit, getSpecialtool);
router.post("/decision",checkLimit, getDecision);
router.post("/getseo",checkLimit, getSeo);
router.post("/code",checkLimit, getCodeConverter);
router.post('/resize',checkLimit, multer({ dest: 'uploads/' }).single('image'), resizeImage);


module.exports = router;
