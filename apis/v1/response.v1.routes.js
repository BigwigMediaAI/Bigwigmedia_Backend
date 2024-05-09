const { getResponse, getParaPhrase, getImage ,getSpecialtool,getDecision,getSeo,resizeImage,getCodeConverter,getMarketing,generateQR,generateComponent,convertDocxToPdf,generateLetterhead} = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");
const multer = require('multer');
const path=require("path")



const router = require("express").Router();
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const uploadfile = multer({
    storage: storage,
  }).single("file");

  const storagefile = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Save uploaded files to "uploads" directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use original filename
    }
  });
  const uploaddata = multer({ storage: storagefile });


router.post("/", checkLimit, getResponse);
router.post("/paraphrase", checkLimit, getParaPhrase);
router.post("/image", checkLimit, getImage);
router.post("/special",checkLimit, getSpecialtool);
router.post("/decision",checkLimit, getDecision);
router.post("/getseo",checkLimit, getSeo);
router.post("/code",checkLimit, getCodeConverter);
router.post("/marketing",checkLimit, getMarketing);
router.post('/resize',checkLimit, multer({ dest: 'uploads/' }).single('image'), resizeImage);
router.post("/generate",checkLimit,upload.single('logo'),generateQR)
router.post("/component",checkLimit,generateComponent)
router.post('/generateLetterhead', uploaddata.single('logo'), generateLetterhead);




module.exports = router;
