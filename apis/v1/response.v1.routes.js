const { getResponse, getParaPhrase, getImage ,JpgtoPngconverter,pngtojpgcoverter,getSpecialtool,getDecision,getSeo,resizeImage,getCodeConverter,getMarketing,generateQR,generateComponent,getRepharsedata,uploadImage,jpgtopdfconverter,mergePDF,pngtopdfconverter,convertVideoToAudio,fbDownloader,twitterDownloader,text2Pdf,Podcast,svgConverter} = require("../../controllers/response.controllers");
const { checkLimit } = require("../../middleware/limitCheck.middleware");
const multer = require('multer');
const path=require("path")



const router = require("express").Router();
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});
const uploadfile = multer({ storage: storage });




 


router.post("/", checkLimit, getResponse);
router.post("/paraphrase",checkLimit, getParaPhrase);
router.post("/image", checkLimit, getImage);
router.post("/special",checkLimit, getSpecialtool);
router.post("/decision",checkLimit, getDecision);
router.post("/getseo",checkLimit, getSeo);
router.post("/code",checkLimit, getCodeConverter);
router.post("/marketing",checkLimit, getMarketing);
router.post('/resize',checkLimit, multer({ dest: 'uploads/' }).single('image'), resizeImage);
router.post("/generate",checkLimit,upload.single('logo'),generateQR)
router.post("/component",checkLimit,generateComponent)
router.post("/rephrase",checkLimit,getRepharsedata);
router.post('/upload',checkLimit, multer({ dest: 'uploads/' }).single('image'), uploadImage);
router.post("/jpg2pdf",checkLimit,upload.array('images',10),jpgtopdfconverter)
router.post("/mergePDF",checkLimit,uploadfile.array('pdfFiles'),mergePDF)
router.post("/png2pdf",checkLimit,upload.array('images',10),pngtopdfconverter)
router.post('/convert',checkLimit, upload.single('video'), convertVideoToAudio);
router.post("/pngtojpg",checkLimit,upload.single("image"),pngtojpgcoverter)
router.post("/jpgtopng",checkLimit,upload.single("image"),JpgtoPngconverter)

router.post("/fbinstadownload",checkLimit,fbDownloader)
router.post("/twitterdownload",checkLimit,twitterDownloader)
router.post("/text2pdf",checkLimit,text2Pdf)
router.post("/podcast",checkLimit,Podcast)
router.post("/svgconvert",upload.single('image'),svgConverter)

module.exports = router;
