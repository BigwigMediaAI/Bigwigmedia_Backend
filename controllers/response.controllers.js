const Templete = require("../models/templetes.models");
const User = require("../models/users.models");
const generatePrompt = require("../utils.js/generatePrompt.utils");
const generateResponse = require("../utils.js/generateResponse.utils");
const removeEmoji = require("../utils.js/removeEmoji");
const removeHashtag = require("../utils.js/removeHashtag");
const getRepharse=require("../utils.js/generateRephrase")
const path = require("path");
const processImage=require("../utils.js/ImageToText")
const Seopodcast=require("../utils.js/SeoPodcast")
const potrace = require('potrace');
const archiver = require('archiver');
const getSummary=require("../utils.js/getSummary");
const AdmZip = require('adm-zip');




const {
    response_500,
    response_200,
} = require("../utils.js/responseCodes.utils");
// const libreoffice=require("libreoffice-convert")
// const puppeteer = require('puppeteer');
// const { engine } = require("express-handlebars");
// const bodyParser = require('body-parser');


const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
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
const { getNotesSummary } = require('../utils.js/notesSummary');
const pdfParse = require('pdf-parse');
const getCompanyNames=require("../utils.js/GenerateBusinessName")
const  translateText =require("../utils.js/translatePdf")
const generateDomainNames=require("../utils.js/domianNameGenerator")

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



 exports.uploadImage=async(req, res)=> {
    try {
        // Check if file is provided
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Process the uploaded image
        const text = await processImage(req.file.path);

        // Send the extracted text back to the client
        res.send(text);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error processing image.');
    }
}




// image to pdf

const fsExtra = require('fs-extra');
  const { PDFDocument } = require('pdf-lib');

  exports.jpgtopdfconverter=async (req,res)=>{
    try {
        const jpgFiles = req.files;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < jpgFiles.length; i++) {
            const jpgFilePath = jpgFiles[i].path;

            // Load JPG image
            const jpgData = await fsExtra.readFile(jpgFilePath);

            // Add a new page for each image
            const page = pdfDoc.addPage([612, 792]); // Letter size page

            // Embed the JPG image into the PDF
            const jpgImage = await pdfDoc.embedJpg(jpgData);
            const jpgDims = jpgImage.scale(1);

            // Calculate dimensions to fit the entire image onto the page
            const { width, height } = jpgDims;
            const pdfWidth = page.getWidth();
            const pdfHeight = page.getHeight();
            const scaleFactor = Math.min(pdfWidth / width, pdfHeight / height);

            // Calculate the scaled dimensions
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;

            // Calculate the position to center the image on the page
            const offsetX = (pdfWidth - scaledWidth) / 2;
            const offsetY = (pdfHeight - scaledHeight) / 2;

            page.drawImage(jpgImage, {
                x: offsetX,
                y: offsetY,
                width: scaledWidth,
                height: scaledHeight,
            });

            // Delete the uploaded image file
            await fsExtra.unlink(jpgFilePath);
        }

        // Serialize the PDF to a binary string
        const pdfBytes = await pdfDoc.save();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');

        // Send the PDF binary data as response
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
  }

// *******png to pdf ******
exports.pngtopdfconverter = async (req, res) => {
    try {
        const imageFiles = req.files;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < imageFiles.length; i++) {
            const imageFile = imageFiles[i];
            const imagePath = imageFile.path;

            // Determine image type (only png is supported)
            const imageType = imageFile.mimetype.split('/')[1];
            if (imageType !== 'png') {
                throw new Error('Unsupported image type');
            }

            // Load image data
            const imageData = await fs.promises.readFile(imagePath); // Use fs.promises.readFile

            // Add a new page for each image
            const page = pdfDoc.addPage([612, 792]); // Letter size page

            // Embed the image into the PDF
            const imageEmbed = await pdfDoc.embedPng(imageData);

            const imageDims = imageEmbed.scale(1);

            // Calculate dimensions to fit the entire image onto the page
            const { width, height } = imageDims;
            const pdfWidth = page.getWidth();
            const pdfHeight = page.getHeight();
            const scaleFactor = Math.min(pdfWidth / width, pdfHeight / height);

            // Calculate the scaled dimensions
            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;

            // Calculate the position to center the image on the page
            const offsetX = (pdfWidth - scaledWidth) / 2;
            const offsetY = (pdfHeight - scaledHeight) / 2;

            page.drawImage(imageEmbed, {
                x: offsetX,
                y: offsetY,
                width: scaledWidth,
                height: scaledHeight,
            });

            // Delete the uploaded image file
            await fs.promises.unlink(imagePath); // Use fs.promises.unlink
        }

        // Serialize the PDF to a binary string
        const pdfBytes = await pdfDoc.save();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};


//*****merge pdf files***** 
exports.mergePDF=async(req,res)=>{
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least two PDF files.' });
        }

        // Merge PDF files
        const mergedPdf = await PDFDocument.create();
        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        // Save merged PDF to a file
        const outputPath = 'merged.pdf';
        const mergedPdfBytes = await mergedPdf.save();
        fs.writeFileSync(outputPath, mergedPdfBytes);

        // Delete uploaded PDF files after merging
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
            // console.log(Deleted file: ${file.path});
        });

        // Send the merged PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.download(outputPath, 'merged.pdf', (err) => {
            // Check for any error while sending the response
            if (err) {
                console.error('Error sending merged PDF:', err);
                res.status(500).json({ error: 'An error occurred while sending the merged PDF.' });
            } else {
                // Delete the merged PDF file after sending it
                fs.unlink(outputPath, (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error deleting merged PDF file:', deleteErr);
                    } else {
                        // console.log(Deleted file: ${outputPath});
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while merging PDF files.' });
    }
  }



// ******video to audio******

ffmpeg.setFfmpegPath(ffmpegPath);

exports.convertVideoToAudio = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const inputVideoPath = req.file.path;
      const outputAudioPath = path.join('./converted', `${path.parse(inputVideoPath).name}.mp3`);
  
      ffmpeg(inputVideoPath)
        .noVideo() // Remove video stream
        .audioCodec('libmp3lame') // Choose audio codec
        .save(outputAudioPath)
        .on('end', () => {
          // Send the converted audio file as response
          res.download(outputAudioPath, (err) => {
            if (err) {
              console.error('Error sending file:', err);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              // Cleanup: Delete the uploaded video and converted audio files
              fs.unlinkSync(inputVideoPath);
              fs.unlinkSync(outputAudioPath);
            }
          });
        })
        .on('error', (err) => {
          console.error('Error converting file:', err);
          res.status(500).json({ error: 'Error converting file' });
        });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// png to jpg converter 

  exports.pngtojpgcoverter=async(req,res)=>{
    try {
        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }
    
        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
    
        if (fileExt !== '.png') {
          fs.unlinkSync(filePath); // Delete the file
          return res.status(400).send('Only PNG files are allowed.');
        }
    
        const outputFilePath = filePath + '.jpg'; // Use .jpg extension
    
        await sharp(filePath)
          .jpeg()
          .toFile(outputFilePath);
    
        res.download(outputFilePath, 'converted.jpg', (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          fs.unlinkSync(filePath); // Delete the original PNG file
          fs.unlinkSync(outputFilePath); // Delete the converted JPG file
        });
    
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred while processing the file.');
      }
  }


//   jpg to png converter


exports.JpgtoPngconverter=async(req,res)=>{
    try {
        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }
    
        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
    
        if (fileExt !== '.jpg' && fileExt !== '.jpeg') {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            }
          });
          return res.status(400).send('Only JPG files are allowed.');
        }
    
        const outputFilePath = filePath + '.png'; // Use .png extension
    
        await sharp(filePath)
          .png()
          .toFile(outputFilePath);
    
        res.download(outputFilePath, 'converted.png', (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
    
          // Delay deletion to ensure file is not in use
          setTimeout(() => {
            // fs.unlink(filePath, (err) => {
            //   if (err) {
            //     console.error('Error deleting original file:', err);
            //   }
            // });
            fs.unlink(outputFilePath, (err) => {
              if (err) {
                console.error('Error deleting converted file:', err);
              }
            });
          }, 1000); // 1 second delay
    
        });
    
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred while processing the file.');
      }
}


// ******** Facebook video downloader **************

const { ndown } = require('nayan-media-downloader');
exports.fbDownloader=async(req,res)=>{
    const url = req.body.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const downloadUrl = await ndown(url);
    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error downloading media', details: error.message });
  }
}



// ******** Twitter video downloader **************

const { twitterdown } = require('nayan-media-downloader');
exports.twitterDownloader=async(req,res)=>{
    const url = req.body.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const downloadUrl = await twitterdown(url);
    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error downloading media', details: error.message });
  }
}




// ******** Text to PDF Converter **************

const PDFKit = require('pdfkit');
exports.text2Pdf=(req,res)=>{
  const { text } = req.body;

    // Check if the text is provided
    if (!text) {
        return res.status(400).json({ error: 'Text is required in the request body' });
    }

    // Create a new PDF document
    const doc = new PDFKit();

    // Buffer to store the PDF
    let buffers = [];

    // Write text to the PDF
    doc.text(text);

    // Save the PDF to a buffer
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
        res.send(pdfBuffer);
    });

    // Error handling
    doc.on('error', (err) => {
        console.error('Error creating PDF:', err);
        res.status(500).json({ error: 'An error occurred while creating PDF' });
    });

    // End the document
    doc.end();

}


// podcast

exports.Podcast= async(req,res)=>{
  try {
    const { prompt,topic, guest, background, interests, tone } = req.body;
   const response=await Seopodcast(prompt,topic, guest, background, interests, tone);
  //  console.log(response)
   response_200(res,"SEO analysis completed succesfully",{data:response});
  } catch (error) {
   response_500(res,"Error performing SEO analysis",error);
  }
}


// image to svg

// ******** Image To SVG converter *************


exports.svgConverter=(req,res)=>{
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
}

const inputPath = req.file.path;
const outputPath = `uploads/${req.file.filename}.svg`;

sharp(inputPath)
    .toBuffer()
    .then(buffer => {
        potrace.trace(buffer, (err, svg) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while processing the image.');
            }
            fs.writeFileSync(outputPath, svg);
            res.sendFile(path.resolve(outputPath), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('An error occurred while sending the SVG file.');
                }
                // fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
                
            });
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('An error occurred while processing the image.');
    });
}



// ************ Zip maker *************

exports.zipmaker=(req,res)=>{
    // Get the uploaded files from the request object
  const uploadedFiles = req.files;

  // Create a new archiver instance
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  // Pipe the archive to the response object
  archive.pipe(res);

  // Add uploaded files to the zip
  uploadedFiles.forEach(file => {
    const filePath = file.path;
    const originalName = file.originalname;

    archive.file(filePath, { name: originalName }); // Add each file to the archive with its original name
  });

  // Finalize the zip and send the response
  archive.finalize();

  // Clean up uploaded files after sending the response
  archive.on('end', () => {
    uploadedFiles.forEach(file => fs.unlinkSync(file.path)); // Delete each uploaded file
  });
}


// ********Gif converter************


ffmpeg.setFfmpegPath(ffmpegPath);

// Helper function to convert time string (HH:MM:SS) to seconds
const timeToSeconds = (time) => {
  const parts = time.split(':');
  return (+parts[0] * 3600) + (+parts[1] * 60) + (+parts[2]);
};

exports.gifConverter=(req,res)=>{
  const { start, end } = req.body;
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, 'output.gif');

  const startTimeInSeconds = timeToSeconds(start);
  const endTimeInSeconds = timeToSeconds(end);
  const duration = endTimeInSeconds - startTimeInSeconds;

  ffmpeg(inputPath)
    .setStartTime(startTimeInSeconds)
    .duration(duration)
    .outputOptions([
      '-vf', 'fps=10,scale=320:-1:flags=lanczos',
      '-c:v', 'gif'
    ])
    .on('end', function() {
      res.download(outputPath, () => {
        // Clean up files
        fs.unlink(inputPath, (err) => {
          if (err) {
            console.error('Error deleting input file:', err);
          }
        });
        fs.unlink(outputPath, (err) => {
          if (err) {
            console.error('Error deleting output file:', err);
          }
        });
      });
    })
    .on('error', function(err) {
      console.error('Error: ' + err.message);
      res.status(500).send('An error occurred during the conversion process.');
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error('Error deleting input file after error:', err);
        }
      });
    })
    .save(outputPath);

}

// ********summary generator*******



exports.getTextSummary = async (req, res) => {
  try {
      const { text } = req.body;
      const summary = await getSummary(text);
      res.status(200).json({ summary });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error generating text summary" });
  }
};


// ********Zip Extractor********


const clearExtractedDirectory = (extractPath) => {
  if (fs.existsSync(extractPath)) {
    fs.readdirSync(extractPath).forEach((file) => {
      const filePath = path.join(extractPath, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
};

exports.zipExtractor = (req, res) => {
  if (req.method === 'POST') {
    try {
      const zipFilePath = req.file.path;
      const zip = new AdmZip(zipFilePath);
      const extractPath = path.join(__dirname, '..', 'extracted');

      // Clear the extracted directory before extracting new files
      clearExtractedDirectory(extractPath);

      // Ensure the extract directory exists
      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath);
      }

      // Extract the zip file
      zip.extractAllTo(extractPath, true);

      // Get the list of extracted files
      const extractedFiles = fs.readdirSync(extractPath).map(file => ({
        filename: file,
        url:`/files?filename=${encodeURIComponent(file)}`
      }));

      // Clean up the uploaded zip file
      fs.unlinkSync(zipFilePath);

      // Send the list of extracted files in the response
      res.json({ files: extractedFiles });
    } catch (error) {
      console.error('Error extracting zip file:', error);
      res.status(500).send('Error extracting zip file.');
    }
  } else if (req.method === 'GET' && req.query.filename) {
    const filePath = path.join(__dirname, '..', 'extracted', req.query.filename);
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file.');
      }
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};


// ********Quick Notes Summarizer**********

exports.getNotesSummary = async (req, res) => {
  try {
      const { notes } = req.body;
      const summary = await getNotesSummary(notes);
      res.status(200).json({ summary });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error generating notes summary" });
  }
};


// ********PDF to Text**********


exports.pdftotext=async(req,res)=>{
  const filePath = req.file.path;

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        res.send({ text: data.text });
        // Optionally, delete the file after extraction
        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).send({ error: `Error extracting text from PDF: ${error.message} `});
        fs.unlinkSync(filePath);
    }
}


// ************Compressed video file**********
exports.compressedVideo = async (req, res) => {
  const filePath = req.file.path;
    const outputFilePath = 'uploads/' + Date.now() + '.mp4';

    ffmpeg(filePath)
        .output(outputFilePath)
        .videoCodec('libx264')
        .size('50%')
        .on('end', () => {
            fs.unlinkSync(filePath); // Remove original file
            res.download(outputFilePath, path.basename(outputFilePath), (err) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).json({
                        success: false,
                        message: 'An error occurred during the download.'
                    });
                } else {
                    fs.unlinkSync(outputFilePath); // Remove compressed file after download
                }
            });
        })
        .on('error', (err) => {
            console.error('Error:', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred during the compression process.'
            });
        })
        .run();

}


// ********Extract images from pdf**********


const {  PDFName, PDFRawStream } = require('pdf-lib');
const { PNG } = require('pngjs');
const pako = require('pako');


const PngColorTypes = {
  Grayscale: 0,
  Rgb: 2,
  IndexedColor: 3,
  GrayscaleAlpha: 4,
  RgbAlpha: 6
};

const ComponentsPerPixelOfColorType = {
  [PngColorTypes.Grayscale]: 1,
  [PngColorTypes.Rgb]: 3,
  [PngColorTypes.IndexedColor]: 1,
  [PngColorTypes.GrayscaleAlpha]: 2,
  [PngColorTypes.RgbAlpha]: 4
};


function readBitAtOffsetOfArray(array, offset) {
  const byteIndex = Math.floor(offset / 8);
  const bitIndex = 7 - (offset % 8);
  return (array[byteIndex] >> bitIndex) & 1;
}


exports.extractpdftoimages=async(req,res)=>{
  try {
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).send('No file uploaded.');
    }

    console.log('File uploaded:', req.file);

    const pdfPath = req.file.path;
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const imagesInDoc = [];
    let objectIdx = 0;

    for (const [ref, pdfObject] of pdfDoc.context.indirectObjects) {
      objectIdx += 1;

      if (!(pdfObject instanceof PDFRawStream)) continue;

      const dict = pdfObject.dict;

      const smaskRef = dict.get(PDFName.of('SMask'));
      const colorSpace = dict.get(PDFName.of('ColorSpace'));
      const subtype = dict.get(PDFName.of('Subtype'));
      const width = dict.get(PDFName.of('Width'));
      const height = dict.get(PDFName.of('Height'));
      const name = dict.get(PDFName.of('Name'));
      const bitsPerComponent = dict.get(PDFName.of('BitsPerComponent'));
      const filter = dict.get(PDFName.of('Filter'));

      if (subtype === PDFName.of('Image')) {
        imagesInDoc.push({
          ref,
          smaskRef,
          colorSpace,
          name: name ? name.key : `Object${objectIdx}`,
          width: width.value,
          height: height.value,
          bitsPerComponent: bitsPerComponent.value,
          data: pdfObject.contents,
          type: filter === PDFName.of('DCTDecode') ? 'jpg' : 'png',
        });
      }
    }

    imagesInDoc.forEach(image => {
      if (image.type === 'png' && image.smaskRef) {
        const smaskImg = imagesInDoc.find(({ ref }) => ref === image.smaskRef);
        if (smaskImg) {
          smaskImg.isAlphaLayer = true;
          image.alphaLayer = smaskImg;
        }
      }
    });

    const savePng = image =>
      new Promise((resolve, reject) => {
        const isGrayscale = image.colorSpace === PDFName.of('DeviceGray');
        const colorPixels = pako.inflate(image.data);
        const alphaPixels = image.alphaLayer ? pako.inflate(image.alphaLayer.data) : undefined;

        const colorType =
          isGrayscale && alphaPixels ? PngColorTypes.GrayscaleAlpha
          : !isGrayscale && alphaPixels ? PngColorTypes.RgbAlpha
          : isGrayscale ? PngColorTypes.Grayscale
          : PngColorTypes.Rgb;

        const colorByteSize = 1;
        const width = image.width * colorByteSize;
        const height = image.height * colorByteSize;
        const inputHasAlpha = [PngColorTypes.RgbAlpha, PngColorTypes.GrayscaleAlpha].includes(colorType);

        const png = new PNG({
          width,
          height,
          colorType,
          inputColorType: colorType,
          inputHasAlpha,
        });

        const componentsPerPixel = ComponentsPerPixelOfColorType[colorType];
        png.data = new Uint8Array(width * height * componentsPerPixel);

        let colorPixelIdx = 0;
        let pixelIdx = 0;

        while (pixelIdx < png.data.length) {
          if (colorType === PngColorTypes.Rgb) {
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
          } else if (colorType === PngColorTypes.RgbAlpha) {
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
            png.data[pixelIdx++] = colorPixels[colorPixelIdx++];
            png.data[pixelIdx++] = alphaPixels[colorPixelIdx - 1];
          } else if (colorType === PngColorTypes.Grayscale) {
            const bit = readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0 ? 0x00 : 0xff;
            png.data[png.data.length - pixelIdx++] = bit;
          } else if (colorType === PngColorTypes.GrayscaleAlpha) {
            const bit = readBitAtOffsetOfArray(colorPixels, colorPixelIdx++) === 0 ? 0x00 : 0xff;
            png.data[png.data.length - pixelIdx++] = bit;
            png.data[png.data.length - pixelIdx++] = alphaPixels[colorPixelIdx - 1];
          } else {
            throw new Error(`Unknown colorType=${colorType}`);
          }
        }

        const buffer = [];
        png
          .pack()
          .on('data', data => buffer.push(...data))
          .on('end', () => resolve(Buffer.from(buffer)))
          .on('error', err => reject(err));
      });

    fs.rm('./images', { recursive: true, force: true }, async err => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      fs.mkdirSync('./images', { recursive: true });

      const imageFiles = [];

      for (const img of imagesInDoc) {
        if (!img.isAlphaLayer) {
          const imageData = img.type === 'jpg' ? img.data : await savePng(img);
          const fileName = `out${imageFiles.length + 1}.png`;
          fs.writeFileSync(path.join('./images', fileName), imageData);
          imageFiles.push(fileName);
        }
      }

      fs.unlink(pdfPath, err => {
        if (err) {
          console.error('Error deleting PDF file:', err);
        } else {
          console.log('PDF file deleted successfully');
        }
      });

      const zipFileName = 'images.zip';
      const zipFilePath = path.join(__dirname, zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('Archiver has been finalized and the output file descriptor has closed.');
        res.download(zipFilePath, zipFileName, err => {
          if (err) {
            console.error('Error downloading zip file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            fs.unlink(zipFilePath, err => {
              if (err) {
                console.error('Error deleting zip file:', err);
              } else {
                console.log('Zip file deleted successfully');
              }
            });
          }
        });
      });

      output.on('end', () => {
        console.log('Data has been drained');
      });

      archive.on('warning', err => {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      });

      archive.on('error', err => {
        throw err;
      });

      archive.pipe(output);

      imageFiles.forEach(file => {
        archive.file(path.join('./images', file), { name: file });
      });

      archive.finalize();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


// Business name generator

exports.getCompany= async(req,res)=>{
  try {
    const {companyType, companyMission, targetAudience, namingStyle, competitor, languagePreference } = req.body;
   const response=await getCompanyNames(companyType, companyMission, targetAudience, namingStyle, competitor, languagePreference);
  //  console.log(response)
   response_200(res,"Response completed succesfully",{data:response});
  } catch (error) {
   response_500(res,"Error performing SEO analysis",error);
  }
}


// *********PDF Translator**********

exports.pdfTranslate=async(req,res)=>{
  try {
    const file = req.file;
    const targetLanguage = req.body.language;
    
    if (!targetLanguage) {
        return res.status(400).json({ error: 'Target language is required' });
    }
    // Read the PDF file
    const dataBuffer = fs.readFileSync(file.path);

    // Extract text from the PDF
    const data = await pdfParse(dataBuffer);
    const extractedText = data.text;

    // Translate the extracted text
    const translation = await translateText(extractedText, targetLanguage);

    // Respond with the translated text
    res.json({ translatedText: translation });

    // Clean up the uploaded file
    fs.unlinkSync(file.path);
} catch (error) {
    res.status(500).json({ error: error.message });
}
}


// ************Domain Name Generator****************


exports.getDomainNames = async (req, res) => {
  try {
      const {companyName, companyType,length, count } = req.body; // You can adjust the request body fields as needed
      
      // Call the domain name generator function
      const domainNames = await generateDomainNames(companyName,companyType,length, count);
      
      // Send the generated domain names as a response
      res.status(200).json({ success: true, data: domainNames });
  } catch (error) {
      // Handle errors
      console.error('Error generating domain names:', error);
      res.status(500).json({ success: false, error: 'Error generating domain names' });
  }
};