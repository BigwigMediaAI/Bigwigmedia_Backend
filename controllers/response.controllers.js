const Templete = require("../models/templetes.models");
const User = require("../models/users.models");
const generatePrompt = require("../utils.js/generatePrompt.utils");
const generateResponse = require("../utils.js/generateResponse.utils");
const removeEmoji = require("../utils.js/removeEmoji");
const removeHashtag = require("../utils.js/removeHashtag");
const getRepharse=require("../utils.js/generateRephrase")
const path = require("path");
const {
    response_500,
    response_200,
} = require("../utils.js/responseCodes.utils");
// const libreoffice=require("libreoffice-convert")
// const puppeteer = require('puppeteer');
// const { engine } = require("express-handlebars");
// const bodyParser = require('body-parser');




const generateParaphrase = require("../utils.js/generateParaphrase");
const getSpecialtool=require("../utils.js/generateSpecialtool");
const getDecision=require("../utils.js/generateDecision")
const getCodeConverter=require("../utils.js/generateCodeconverter")
const generateComponent=require("../utils.js/generateComponent")
const getSeo=require("../utils.js/generateSeo")
const getMarketing=require("../utils.js/generateMarketing")
const sharp = require('sharp');
const fs = require('fs');
const multer = require('multer');
const generateQRCodeWithLogo=require("../utils.js/generateQRcode")
const { generateImage, QUALITY } = require("../utils.js/generateImage");
exports.getResponse = async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const tone = req.body.tone;
        const useEmoji = String(req.body.useEmoji);
        const useHashTags = String(req.body.useHashTags);
        const templateId = req.body.templateId;
        const template = await Templete.findById(templateId);
        console.log(req.body);

        // get user from req.user
        const user = await User.findById(req.user._id);

        // decrease limits
        await user.descreseLimit();
        console.log(user);
        console.log(template);

        // generate prompt
        const generatedPrompt = generatePrompt(
            template.templete,
            prompt,
            tone,
            useEmoji === "true" ? true : false,
            useHashTags === "true" ? true : false
        );
        console.log(generatedPrompt);

        let response = await generateResponse(generatedPrompt);
        console.log(response);
        if (useEmoji !== "true") {
            response = removeEmoji(response);
        }

        if (useHashTags !== "true") {
            response = removeHashtag(response);
        }

        response_200(res, "Response generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting response", error);
    }
};

exports.getParaPhrase = async (req, res) => {
    try {
        const {prompt,tone} = req.body;
        const response = await generateParaphrase(prompt,tone);
        response_200(res, "Paraphrase generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting paraphrase", error);
    }
};

exports.getSpecialtool=async(req,res)=>{
    try {
        const prompt=req.body.prompt;
        const response=await getSpecialtool(prompt);
        response_200(res, "response generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting response", error);

    }
}

exports.getDecision = async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await getDecision(prompt);

        // Check if pros and cons are present in the response
        if (response.pros.length === 0 || response.cons.length === 0) {
            response_500(res, "No pros and cons found in the response");
            return;
        }

        response_200(res, "Pros and cons generated successfully", { data: response });
    } catch (error) {
        response_500(res, "Error getting response", error);
    }
}

exports.getSeo= async(req,res)=>{
   try {
    const prompt=req.body.prompt;
    const response=await getSeo(prompt);
    console.log(response)
    response_200(res,"SEO analysis completed succesfully",{data:response});
   } catch (error) {
    response_500(res,"Error performing SEO analysis",error);
   }
}



exports.getImage = async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const n = req.body.n;
        const quality = req.body.quality || QUALITY.STANDARD;
        const style = req.body.style;
        // check quality is valid
        if (!Object.values(QUALITY).includes(quality)) {
            response_500(res, "Invalid quality", null);
            return;
        }
        const response = (await generateImage(prompt, n, quality, style)).map(
            x => x.url
        );
        response_200(res, "Image generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting image", error);
    }
};


// photo resizer function controller
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Resize options for different platforms
const resizeOptions = {
    facebook: {
        profilePicture: { width: 180, height: 180 },
        coverPhoto: { width: 820, height: 312 },
        sharedImage: { width: 1200, height: 630 }
    },
    instagram: {
        profilePicture: { width: 110, height: 110 },
        squareImage: { width: 1080, height: 1080 },
        landscapeImage: { width: 1080, height: 566 },
        portraitImage: { width: 1080, height: 1350 }
    },
    twitter: {
        profilePicture: { width: 400, height: 400 },
        headerPhoto: { width: 1500, height: 500 },
        sharedImage: { width: 1200, height: 675 }
    },
    linkedin: {
        profilePicture: { width: 400, height: 400 },
        coverPhoto: { width: 1584, height: 396 },
        sharedImage: { width: 1200, height: 627 }
    },
    pinterest: {
        profilePicture: { width: 165, height: 165 },
        pinImage: { width: 1000, height: 1500 }
    },
    snapchat: {
        geofilter: { width: 1080, height: 2340 },
        snapAd: { width: 1080, height: 1920 }
    },
    youtube: {
        channelProfilePicture: { width: 800, height: 800 },
        channelCoverPhoto: { width: 2560, height: 1440 },
        videoThumbnail: { width: 1280, height: 720 }
    }
};

exports.resizeImage = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Get the resize options from the request body
        const platform = req.body.platform;
        const imageType = req.body.type;

        if (!platform || !imageType || !resizeOptions[platform] || !resizeOptions[platform][imageType]) {
            return res.status(400).send('Invalid or missing platform or image type.');
        }

        // Resize the uploaded image using Sharp
        const { width, height } = resizeOptions[platform][imageType];
        const resizedImage = await sharp(req.file.path)
            .resize(width, height, { fit: 'inside' }) // Fit inside the specified dimensions without cropping
            .toBuffer();

        // Send the resized image as a response
        res.set('Content-Type', 'image/jpeg');
        res.send(resizedImage);

        // Delete the uploaded file from the server
        // fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).send('Error resizing image.');
    }
};


// code converter start's here

exports.getCodeConverter=async(req,res)=>{
    const { sourceCode, targetLanguage } = req.body;

    try {
        // Call getCodeConverter function to convert the code
        const convertedCode = await getCodeConverter(sourceCode, targetLanguage);

        // Send the converted code as response
        res.status(200).json({ convertedCode });
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Marketing tool start here

exports.getMarketing=async(req,res)=>{
    try {
        const prompt=req.body.prompt;
        const response=await getMarketing(prompt);
        response_200(res, "response generated successfully", response);
        // console.log(response)
    } catch (error) {
        response_500(res, "Error getting response", error);

    }
}

// QR code starts here





exports.generateQR = async (req, res) => {
    const { url, color, textAboveQR, textBelowQR } = req.body;

    try {
        const logoPath = req.file ? req.file.path : null;
        const filename = path.join(__dirname, 'response.png');
        await generateQRCodeWithLogo(url, filename, logoPath, color, textAboveQR, textBelowQR);

        // Send QR code with logo image as response
        res.sendFile('response.png', { root: __dirname });

        // Delete the uploaded logo file after sending the response
        if (logoPath) {
            fs.unlinkSync(logoPath);
        }
    } catch (error) {
        console.error('Error generating QR code with logo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.generateComponent=async(req,res)=>{
    const { command, structure, design } = req.body;

    try {
      // Generate code based on user's input and selected options
      const generatedCode = await generateComponent(command, structure, design);
      res.json({ code: generatedCode });
    } catch (error) {
      console.error('Error generating code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getRepharsedata = async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await getRepharse(prompt);


        response_200(res, "Pros and cons generated successfully", { data: response });
    } catch (error) {
        response_500(res, "Error getting response", error);
    }
}



