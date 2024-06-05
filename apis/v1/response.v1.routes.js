const { getResponse, getParaPhrase, getImage ,JpgtoPngconverter,pngtojpgcoverter,getSpecialtool,getDecision,getSeo,resizeImage,getCodeConverter,getMarketing,generateQR,generateComponent,getRepharsedata,uploadImage,jpgtopdfconverter,mergePDF,pngtopdfconverter,convertVideoToAudio,fbDownloader,twitterDownloader,text2Pdf,Podcast,svgConverter,zipmaker,gifConverter,getTextSummary,zipExtractor,getNotesSummary,pdftotext,compressedVideo,extractpdftoimages ,getCompany,pdfTranslate,getDomainNames,video_Text_converter,generateCurrentTopics,trimvideo,trimaudio,NDA_Agreement,deletepdf,Business_Slogan,NCA_Agreement,generateYouTubeScript} = require("../../controllers/response.controllers");
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
router.post("/svgconvert",checkLimit,upload.single('image'),svgConverter)
router.post("/zip",checkLimit,upload.array('files'),zipmaker)
router.post("/gif",checkLimit,upload.single("video"),gifConverter)
router.post("/getSummary",checkLimit, getTextSummary);
router.all("/files",checkLimit,upload.single('zipfile'),zipExtractor)
router.post('/getNotesSummary',checkLimit, getNotesSummary);
router.post('/pdf2text',checkLimit,upload.single('pdf'),pdftotext)
router.post("/compressedVideo",checkLimit,upload.single('video'),compressedVideo)
router.post('/extract',checkLimit, upload.single('pdf'),extractpdftoimages)
router.post('/company',checkLimit,getCompany)
router.post('/translate',checkLimit,upload.single("pdf"),pdfTranslate)
router.post('/domain',checkLimit, getDomainNames);
router.post('/video2text',checkLimit,upload.single('video'),video_Text_converter)
router.post('/current-topics',checkLimit, generateCurrentTopics);
router.post('/trim-video',checkLimit,upload.single('video'),trimvideo)
router.post('/trim-audio',checkLimit,upload.single('audio'),trimaudio)
router.post('/nda',checkLimit,NDA_Agreement)
router.post('/delete-pages',checkLimit,upload.single('pdf'),deletepdf)
router.post('/slogan',Business_Slogan)
router.post('/nca',NCA_Agreement)
router.post('/youtubescript',generateYouTubeScript)

module.exports = router;
