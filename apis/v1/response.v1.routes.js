const { getResponse,
   getParaPhrase,
    getImage,
    generateLogo 
,JpgtoPngconverter
,pngtojpgcoverter
,getSpecialtool
,getDecision
,getSeo
,resizeImage
,getCodeConverter,
getMarketing,
generateQR,
generateComponent,
getRepharsedata,
uploadImage,
jpgtopdfconverter,
mergePDF,
pngtopdfconverter,
convertVideoToAudio,
fbDownloader,
twitterDownloader,
text2Pdf,
Podcast,
svgConverter,
zipmaker,
gifConverter,
getTextSummary,
zipExtractor,
getNotesSummary,
pdftotext,
compressedVideo,
extractpdftoimages ,
getCompany,pdfTranslate,getDomainNames,video_Text_converter,generateCurrentTopics,trimvideo,trimaudio,NDA_Agreement,deletepdf,Business_Slogan,NCA_Agreement,generateYouTubeScript,TriviaGenerate,improveContent,removeAudio,genratedPolicy,generatePoll,generateBusinessPlan,addAudio,uploadAndSummarize,chatWithPdf,languageTranslation,audioTranslate,videoTranlator,youtubeTranslator,financeadvisor,AiDetector,newsSummerizer,generateTextInfographic,createAvatar,compressImage,generateSWOT,generateCoverLetter,downloadytdl,generateLinkedInPost,generateLinkedInBio,generateLinkedInRecommendation,generateConnectionRequest,youtubeDownloader,aboutMe,tiktokCaptionGenerate,generateTitle,generateVideoTitle,generateVideoIdeas,generateScriptOutline,CalenderContentGenerator,tiktokhastag,generateReelScript,generateReelIdeas,generateAboutCompanyPage,generateTweetReply,generateSocialMediaPost,generateBulletPoints,generateEventName,generateProfessionalBio,generateSeoBrief,generateCompanyProfile,generateEventInvitationEmail,generateTinderBio,generateEventReminderEmail,generateInstagramHashtags,generateFollowUpEmail,generateJobOfferLetter,generateResumeSkills,generateElevatorPitch,generateEmailSubjectLine,generateReviewResponse,generateJobDescription,generateResignationLetter,generatePerformanceReview,generateCallToAction,generateMeetingInvite,generateProjectReport,generateGMBProductDescription,generateGMBPost,generateProductDescription,generateReferenceLetter,generateProductName,generateCatchyTagline,generateBusinessProposal,generateSOP,generateExperienceLetter,generateMotto,generateProductBrochure,generateBusinessMemo,generatePAS,generateAIDA,generateColdEmail,generateMetaDescription,generateNewsletterName
} = require("../../controllers/response.controllers");
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
router.post("/image",checkLimit, getImage);
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
router.post('/getNotesSummary',checkLimit,getNotesSummary);
router.post('/pdf2text',checkLimit,upload.single('pdf'),pdftotext)
router.post("/compressedVideo",checkLimit,upload.single('video'),compressedVideo)
router.post('/extract',checkLimit, upload.single('pdf'),extractpdftoimages)
router.post('/companyName',checkLimit,getCompany)
router.post('/translate',checkLimit,upload.single("pdf"),pdfTranslate)
router.post('/domain',checkLimit, getDomainNames);
router.post('/video2text',checkLimit,upload.single('video'),video_Text_converter)
router.post('/current-topics',checkLimit, generateCurrentTopics);
router.post('/trim-video',checkLimit,upload.single('video'),trimvideo)
router.post('/trim-audio',checkLimit,upload.single('audio'),trimaudio)
router.post('/nda',checkLimit,NDA_Agreement)
router.post('/delete-pages',checkLimit,upload.single('pdf'),deletepdf)
router.post('/slogan',checkLimit,Business_Slogan)
router.post('/nca',checkLimit,NCA_Agreement)
router.post('/youtubescript',checkLimit,generateYouTubeScript)
router.post('/trivia',checkLimit,TriviaGenerate)
router.post('/improve',checkLimit,improveContent);
router.post('/remove-audio',checkLimit,upload.single('video'),removeAudio)
router.post('/generatePolicy',checkLimit, genratedPolicy)
router.post('/generatePoll',checkLimit, generatePoll);
router.post('/businessPlan',checkLimit, generateBusinessPlan);
router.post('/addAudio',checkLimit,upload.fields([{ name: 'video' }, { name: 'audio' }]),addAudio)
router.post('/pdf-summarize',checkLimit, upload.single('pdf'), uploadAndSummarize);
router.post('/pdf-chat',checkLimit, upload.single('pdf'), chatWithPdf);
router.post("/translateLanguage",checkLimit,upload.single('video'),languageTranslation)
router.post("/audio-translate",checkLimit,upload.single('audio'),audioTranslate)
router.post("/video-translate",checkLimit,upload.single('video'),videoTranlator)
router.post("/youtube-translate",checkLimit,youtubeTranslator)
router.post("/finance",checkLimit,financeadvisor)
router.post("/detector",checkLimit,AiDetector)
router.post("/news",checkLimit,newsSummerizer)
router.post('/infographic',checkLimit, generateTextInfographic);
router.get('/avatar',checkLimit,createAvatar)
router.post('/compressImage',checkLimit,upload.single('image'),compressImage)
router.post('/generateSWOT',checkLimit, generateSWOT);
router.post('/generateCoverLetter',checkLimit,generateCoverLetter);
router.post("/logo",checkLimit, generateLogo);
router.post('/generateLinkedInPost',checkLimit, generateLinkedInPost);
router.post('/generateLinkedInBio',checkLimit, generateLinkedInBio);
router.post('/generateLinkedInRecommendation',checkLimit, generateLinkedInRecommendation);
router.post('/generateConnectionRequest',checkLimit, generateConnectionRequest);
router.get("/ytdl",checkLimit,youtubeDownloader)
router.post("/aboutme",checkLimit,aboutMe)
router.post("/tiktokcaption",checkLimit,tiktokCaptionGenerate)
router.post('/generateTitle',checkLimit, generateTitle);
router.post('/generateYtTitle',checkLimit, generateVideoTitle);
router.post('/generateVideoIdeas',checkLimit, generateVideoIdeas);
router.post('/generateYoutubeScriptOutline',checkLimit, generateScriptOutline);
router.post('/generatecalender',checkLimit, CalenderContentGenerator);
router.post('/tiktokhastag',checkLimit, tiktokhastag);
router.post('/generateReelScript',checkLimit, generateReelScript);
router.post('/generateReelIdeas',checkLimit, generateReelIdeas);
router.post('/generateAboutCompanyPage',checkLimit, generateAboutCompanyPage);
router.post('/generateTweetReply',checkLimit, generateTweetReply);
router.post('/generateSocialMediaPost',checkLimit, generateSocialMediaPost);
router.post('/generateBulletPoints',checkLimit, generateBulletPoints);
router.post('/generateBulletPoints',checkLimit, generateBulletPoints);
router.post('/generateEventName',checkLimit, generateEventName);
router.post('/generateProfessionalBio',checkLimit, generateProfessionalBio);
router.post('/generateSeoBrief',checkLimit, generateSeoBrief);
router.post('/generateCompanyProfile',checkLimit, generateCompanyProfile);
router.post('/generateEventInvitationEmail',checkLimit, generateEventInvitationEmail);
router.post('/generateTinderBio',checkLimit, generateTinderBio);
router.post('/generateEventReminderEmail',checkLimit, generateEventReminderEmail);
router.post('/generateInstagramHashtags',checkLimit, generateInstagramHashtags);
router.post('/generateFollowUpEmail',checkLimit, generateFollowUpEmail);
router.post('/generateJobOffer',checkLimit, generateJobOfferLetter);
router.post('/generateResumeSkills',checkLimit, generateResumeSkills);
router.post('/generateElevatorPitch',checkLimit, generateElevatorPitch);
router.post('/generateEmailSubjectLine',checkLimit, generateEmailSubjectLine);
router.post('/generateReviewResponse',checkLimit, generateReviewResponse);
router.post('/generateJobDescription',checkLimit, generateJobDescription);
router.post('/generateResignationLetter',checkLimit, generateResignationLetter);
router.post('/generatePerformanceReview',checkLimit, generatePerformanceReview);
router.post('/generateCallToAction',checkLimit, generateCallToAction);
router.post('/generateMeetingInvite',checkLimit, generateMeetingInvite);
router.post('/generateProjectReport',checkLimit, generateProjectReport);
router.post('/generateGMBProductDescription',checkLimit,generateGMBProductDescription);
router.post('/generateGMBPost',checkLimit,generateGMBPost);
router.post('/generateProductDescription',checkLimit,generateProductDescription);
router.post('/generateReferenceLetter',checkLimit, generateReferenceLetter);
router.post('/generateProductName',checkLimit, generateProductName);
router.post('/generateCatchyTagline',checkLimit, generateCatchyTagline);
router.post('/generateBusinessProposal',checkLimit, generateBusinessProposal);
router.post('/generateSOP',checkLimit, generateSOP);
router.post('/generateExperienceLetter',checkLimit, generateExperienceLetter);
router.post('/generateMotto',generateMotto);
router.post('/generateProductBrochure', generateProductBrochure);
router.post('/generateBusinessMemo', generateBusinessMemo);
router.post('/generatePAS', generatePAS);
router.post('/generateAIDA', generateAIDA);
router.post('/generateColdEmail', generateColdEmail);
router.post('/generateMetaDescription', generateMetaDescription);
router.post('/generateNewsletterName', generateNewsletterName);








module.exports = router;
