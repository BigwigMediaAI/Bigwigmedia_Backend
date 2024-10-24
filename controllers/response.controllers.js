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
const generateNDA=require("../utils.js/generateNDA")
const generateBusinessSlogan=require("../utils.js/generateBusinessSlogan")
const generateNCA=require("../utils.js/generateNCA")
const generateYoutubeScript=require("../utils.js/generateYoutubeScript")
const generateTrivia=require("../utils.js/TriviaGenerator")
const improveContent=require("../utils.js/ContentImprover")
const generatePrivacyPolicy=require("../utils.js/generatePrivacyPolicy")
const generateBusinessPlan=require("../utils.js/generateBusinessPlan")
const detectAIContent=require("../utils.js/aiDetector")
const downloadAndMerge=require("../utils.js/youtubeVideoDownload")
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
        const {prompt,tone,language,outputCount} = req.body;
        const response = await generateParaphrase(prompt,tone,language,outputCount);
        response_200(res, "Paraphrase generated successfully", response);
    } catch (error) {
        response_500(res, "Error getting paraphrase", error);
    }
};

exports.getSpecialtool=async(req,res)=>{
  try {
    const { prompt, outputCount = 1, language = "English" } = req.body;

    // Call the getSpecialtool function with the user input
    const responses = await getSpecialtool(prompt, outputCount, language);

    // Send the responses back to the client
    res.status(200).json({
        success: true,
        data: responses
    });
} catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({
        success: false,
        message: "An error occurred while processing your request."
    });
}
}

exports.getDecision = async (req, res) => {
    try {
        const {prompt,language}=req.body
        const response = await getDecision(prompt,language);

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
        "Facebook Profile Picture": { width: 180, height: 180 },
        "Facebook Cover Photo": { width: 820, height: 312 },
        "Facebook Shared Image": { width: 1200, height: 630 }
    },
    instagram: {
      "Instagram Profile Picture": { width: 110, height: 110 },
      "Instagram Square Image": { width: 1080, height: 1080 },
      "Landscape Image": { width: 1080, height: 566 },
      "Instagram Portrait Image": { width: 1080, height: 1350 }
    },
    twitter: {
        "Twitter Profile Image": { width: 400, height: 400 },
        "Twitter Header Image": { width: 1500, height: 500 },
        "Twitter Shared Image": { width: 1200, height: 675 }
    },
    linkedin: {
        "Linkedin Profile Picture": { width: 400, height: 400 },
        "Linkedin Cover Photo": { width: 1584, height: 396 },
        "Linkedin Shared Image": { width: 1200, height: 627 }
    },
    pinterest: {
      "Pinterest Profile Picture": { width: 165, height: 165 },
      "Pinterest Pin Image": { width: 1000, height: 1500 }
    },
    snapchat: {
      "Snapchat Geo Filter": { width: 1080, height: 2340 },
      "Snapchat SnapAd": { width: 1080, height: 1920 }
    },
    youtube: {
        "Channel Profile Image": { width: 800, height: 800 },
        "Channel Cover Image": { width: 2560, height: 1440 },
        "Video Thumbnail": { width: 1280, height: 720 }
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
        const {prompt,language}=req.body;
        const response=await getMarketing(prompt,language);
        response_200(res, "response generated successfully", response);
        // console.log(response)
    } catch (error) {
        response_500(res, "Error getting response", error);

    }
}





// *************QR Code Generator**************

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

// *************Web Component Generator***********
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

// ******text rephrase******

exports.getRepharsedata = async (req, res) => {
    try {
        const {prompt,language,tone,outputCount}=req.body
        const response = await getRepharse(prompt,language,tone,outputCount);


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

exports.pngtojpgcoverter = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Set the compression level
    });

    // Set headers to download the ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');

    archive.pipe(res); // Pipe the archive to the response

    // Process each uploaded PNG file
    await Promise.all(
      req.files.map(async (file) => {
        const filePath = file.path;
        const fileExt = path.extname(file.originalname).toLowerCase();

        if (fileExt !== '.png') {
          fs.unlinkSync(filePath); // Delete non-PNG files
          return;
        }

        // Convert PNG to JPG
        const outputFilePath = filePath + '.jpg';
        await sharp(filePath).jpeg().toFile(outputFilePath);

        // Add the JPG to the zip archive
        const jpgFilename = path.basename(file.originalname, '.png') + '.jpg';
        const jpgBuffer = fs.readFileSync(outputFilePath);
        archive.append(jpgBuffer, { name: jpgFilename });

        // Delete original and converted files
        fs.unlinkSync(filePath); // Delete the original PNG file
        fs.unlinkSync(outputFilePath); // Delete the converted JPG file
      })
    );

    // Finalize the zip archive
    await archive.finalize();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the files.');
  }
};


//   jpg to png converter


exports.JpgtoPngconverter = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set the compression level
    });

    // Set headers to download the ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');

    archive.pipe(res); // Pipe the archive data to the response

    await Promise.all(req.files.map(async (file) => {
      const filePath = file.path; // Get the path of the uploaded JPG file
      const fileExt = path.extname(file.originalname).toLowerCase();

      if (fileExt !== '.jpg' && fileExt !== '.jpeg') {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
        throw new Error('Only JPG files are allowed.');
      }

      const outputFilePath = filePath + '.png'; // Use .png extension

      // Convert JPG to PNG using sharp
      await sharp(filePath)
        .png()
        .toFile(outputFilePath);

      // Read the converted PNG file
      const pngBuffer = fs.readFileSync(outputFilePath);

      // Add the PNG file to the ZIP archive with the original filename as .png
      const pngFilename = path.parse(file.originalname).name + '.png';
      archive.append(pngBuffer, { name: pngFilename });

      // Delete the uploaded JPG and the converted PNG file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting original file:', err);
      });
      fs.unlink(outputFilePath, (err) => {
        if (err) console.error('Error deleting converted file:', err);
      });
    }));

    // Finalize the archive (finish adding files to the ZIP)
    await archive.finalize();

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the files.');
  }
};


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
    const { prompt,topic, guest, background, interests, tone,language } = req.body;
   const response=await Seopodcast(prompt,topic, guest, background, interests, tone,language);
  //  console.log(response)
   response_200(res,"SEO analysis completed succesfully",{data:response});
  } catch (error) {
   response_500(res,"Error performing SEO analysis",error);
  }
}


// image to svg

// ******** Image To SVG converter *************


exports.svgConverter = async (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded.');
  }

  // Create a zip archive
  const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
  });

  // Set headers to download the ZIP file
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=converted_svgs.zip');

  // Pipe the archive data to the response
  archive.pipe(res);

  try {
      // Process all files concurrently
      await Promise.all(req.files.map(file => {
          return new Promise((resolve, reject) => {
              const inputPath = file.path; // Path to the uploaded file
              const outputFileName = `${path.parse(file.originalname).name}.svg`; // Output SVG name

              // Read and convert the image
              sharp(inputPath)
                  .toBuffer()
                  .then(buffer => {
                      potrace.trace(buffer, (err, svg) => {
                          if (err) {
                              console.error('Error converting image:', err);
                              reject(err); // Reject the promise on error
                          } else {
                              // Append the SVG content to the zip archive
                              archive.append(svg, { name: outputFileName });

                              // Clean up the original file after processing
                              fs.unlink(inputPath, (err) => {
                                if (err) {
                                    console.error('Error deleting the file:', err);
                                }
                            });
                              resolve(); // Resolve the promise after appending
                          }
                      });
                  })
                  .catch(err => {
                      console.error('Error processing image with sharp:', err);
                      reject(err); // Reject the promise on sharp error
                  });
          });
      }));

      // Finalize the archive (signals end of zipping)
      await archive.finalize(); // Ensure finalize is awaited

  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('Error processing images.');
  }
};


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
      const { text,language,outputCount} = req.body;
      const summary = await getSummary(text,language,outputCount);
      res.status(200).json(summary );
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
      const { notes,language } = req.body;
      const summary = await getNotesSummary(notes,language);
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



// *********Video to Text***********

const { extractAndConvertToMP3, transcribeAudio, MAX_SIZE } = require('../utils.js/video2text');

exports.video_Text_converter=async(req,res)=>{
  const videoPath = req.file.path;
  const audioPath = `uploads/${Date.now()}_audio.mp3`;
  const { targetLanguage } = req.body;

  try {
    await extractAndConvertToMP3(videoPath, audioPath);

    // Transcribe the audio
    const transcription = await transcribeAudio(audioPath);

    let finalText = transcription.text;

    // If a target language is provided, translate the transcription
    if (targetLanguage) {
      finalText = await translateText(finalText, targetLanguage);
    }

    res.json({ transcription: finalText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up files
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }
  }
}

// ********Current Topic Generation*********

const generateCurrentTopicsContent = require("../utils.js/currentTopicGenerator");

exports.generateCurrentTopics = async (req, res) => {
  try {
    const { category, keywords, numTopics,language } = req.body;
    const topics = await generateCurrentTopicsContent(category, keywords, numTopics,language);

    response_200(res, "Current topics generated successfully", { topics });
  } catch (error) {
    console.error("Error generating current topics:", error);
    response_500(res, "Error generating current topics", error);
  }
};


// *******Trim Video*****

function parseTime(timeString) {
  const parts = timeString.split(':').map(parseFloat);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}


exports.trimvideo=(req,res)=>{
  const { startTime, endTime } = req.body;
  const inputPath = req.file.path;
  const outputPath = `output-${Date.now()}.mp4`;

  // Calculate duration from start and end times
  const duration = parseTime(endTime) - parseTime(startTime);

  // Use ffmpeg to cut the video
  ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
      .on('end', () => {
          console.log('Video cutting completed');
          // Delete the uploaded file
          fs.unlinkSync(inputPath);
          res.download(outputPath, () => {
              // Cleanup: delete the output file after download
              fs.unlinkSync(outputPath);
          });
      })
      .on('error', (err) => {
          console.error('Error cutting video:', err);
          res.status(500).send('Error cutting video');
      })
      .run();

}


// *************Trim Audio************

exports.trimaudio=(req,res)=>{
  const { startTime, endTime } = req.body;
    const inputPath = req.file.path;
    const outputPath = `output-${Date.now()}.mp3`;

    // Calculate duration from start and end times
    const duration = parseTime(endTime) - parseTime(startTime);

    // Use ffmpeg to cut the audio
    ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => {
            console.log('Audio cutting completed');
            // Delete the uploaded file
            fs.unlinkSync(inputPath);
            res.download(outputPath, () => {
                // Cleanup: delete the output file after download
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Error cutting audio:', err);
            res.status(500).send('Error cutting audio');
        })
        .run();

}

// *****NDA aggrement ****

exports.NDA_Agreement= async (req,res)=>{
  const { disclosingParty, receivingParty,language,DateAgreement } = req.body;

    if (!disclosingParty || !receivingParty) {
        return res.status(400).json({ error: 'Disclosing Party and Receiving Party are required.' });
    }

    try {
        const nda = await generateNDA(disclosingParty, receivingParty,language,DateAgreement);
        res.status(200).json({ nda });
    } catch (error) {
        console.error('Error generating NDA:', error);
        res.status(500).json({ error: 'An error occurred while generating the NDA.' });
    }
}


// ***********Pdf page delete***********

exports.deletepdf=async(req,res)=>{
  try {
    const pagesToDelete = req.body.pagesToDelete.split(',').map(Number);
    const pdfPath = req.file.path;

    // Load the existing PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Copy the pages, excluding the ones to delete
    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
        if (!pagesToDelete.includes(i + 1)) { // Pages are 1-indexed
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);
        }
    }

    // Serialize the PDF document to bytes
    const newPdfBytes = await newPdfDoc.save();

    // Write the new PDF document to a file
    const outputPath = path.join(__dirname, 'output', `modified-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, newPdfBytes);

    // Send the new PDF document as a response
    res.download(outputPath, 'modified.pdf', (err) => {
        if (err) {
            console.error(err);
        }
        fs.unlinkSync(outputPath); // Clean up the output file
        fs.unlinkSync(pdfPath);    // Clean up the uploaded file
    });
} catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the PDF.');
}
}

// **********Business generator**********

exports.Business_Slogan= async (req,res)=>{
  const { businessName, whatItDoes,numberOfSlogans,language } = req.body;

    if (!businessName || !whatItDoes||!numberOfSlogans ||!language) {
        return res.status(400).json({ error: 'businessName and whatItDoes are required.' });
    }

    try {
        const slogan = await generateBusinessSlogan(businessName, whatItDoes,numberOfSlogans,language);
        res.status(200).json({ slogan });
    } catch (error) {
        console.error('Error generating NDA:', error);
        res.status(500).json({ error: 'An error occurred while generating the slogan.' });
    }
}

// ********NCA Agreement********

exports.NCA_Agreement= async (req,res)=>{
  const {employer, employee, restrictedActivities, restrictedDuration, restrictedTerritory,language } = req.body;

    if (!employer || !employee||!restrictedActivities||!restrictedDuration||!restrictedTerritory) {
        return res.status(400).json({ error: 'Disclosing Party and Receiving Party are required.' });
    }

    try {
        const nda = await generateNCA(employer, employee, restrictedActivities, restrictedDuration, restrictedTerritory,language);
        res.status(200).json({ nda });
    } catch (error) {
        console.error('Error generating NDA:', error);
        res.status(500).json({ error: 'An error occurred while generating the NDA.' });
    }
}

// *************Youtube Script Generator************
exports.generateYouTubeScript = async (req, res) => {
  try {
    const { topic,tone,length,language,outputCount } = req.body;
    const script = await generateYoutubeScript(topic,tone, length,language,outputCount);
    res.status(200).json({ script });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating YouTube script" });
  }
};


// *********Trivia Generator*******

exports.TriviaGenerate = async (req, res) => {
  try {
    const { topic, numberOfQuestions, numberOfAnswers, difficultyLevel,language } = req.body;
    const script = await generateTrivia(topic, numberOfQuestions, numberOfAnswers, difficultyLevel,language);
    res.status(200).json({ script });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating YouTube script" });
  }
};

// ********Content improver********
exports.improveContent = async (req, res) => {
  try {
    const { content, tone,language,output} = req.body;
    const improvedContent = await improveContent(content, tone,language,output);

    response_200(res, "Content improved successfully", { improvedContent });
  } catch (error) {
    console.error("Error improving content:", error);
    response_500(res, "Error improving content", error);
  }
};



// ********Remove Audio*******

exports.removeAudio=async(req,res)=>{
  const videoPath = req.file.path;
    const outputPath = path.join('uploads', `no-audio-${req.file.originalname}`);

    ffmpeg(videoPath)
        .noAudio()
        .output(outputPath)
        .on('end', () => {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                }
                // Clean up files
                fs.unlinkSync(videoPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error('Error processing video:', err);
            res.status(500).send('Error processing video');
        })
        .run();
}


// *******Privacy Policy Generator*******
exports.genratedPolicy = async (req, res) => {
  try {
    const { companyName, address, websiteURL,language,outputCount } = req.body;
    const improvedContent = await generatePrivacyPolicy(companyName, address, websiteURL,language,outputCount);

    response_200(res, "Privacy Policy generated successfully", { improvedContent });
  } catch (error) {
    console.error("Error improving content:", error);
    response_500(res, "Error improving content", error);
  }
};




// ********Poll Generator********

const generatePoll=require("../utils.js/pollGenerator")
exports.generatePoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length === 0) {
      return response_400(res, "Invalid input data");
    }

    const poll = await generatePoll(question, options);

    response_200(res, "Poll generated successfully", { poll });
  } catch (error) {
    console.error("Error generating poll:", error);
    response_500(res, "Error generating poll", error);
  }
};



// *******Business Plan Generator***********

exports.generateBusinessPlan = async (req, res) => {
  try {
    const { businessType, industry, targetMarket,language,outputCount } = req.body;
    const plan = await generateBusinessPlan(businessType, industry, targetMarket,language,outputCount);
    res.status(200).json({ businessPlan: plan });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating business plan" });
  }
};


// *********Add audio into video*******

exports.addAudio=async(req,res)=>{
  const videoFile = req.files.video[0];
    const audioFile = req.files.audio[0];
    const { videoStart, videoEnd, audioStart, audioEnd } = req.body;

    const trimmedVideoPath = `uploads/trimmed_video_${Date.now()}.mp4`;
    const trimmedAudioPath = `uploads/trimmed_audio_${Date.now()}.mp3`;
    const outputVideoPath = `uploads/output_${Date.now()}.mp4`;

    // Step 1: Trim video and remove audio
    ffmpeg(videoFile.path)
        .setStartTime(videoStart)
        .setDuration(videoEnd - videoStart)
        .noAudio()
        .output(trimmedVideoPath)
        .on('end', () => {
            // Step 2: Trim audio
            ffmpeg(audioFile.path)
                .setStartTime(audioStart)
                .setDuration(audioEnd - audioStart)
                .output(trimmedAudioPath)
                .on('end', () => {
                    // Step 3: Combine trimmed video and audio
                    ffmpeg(trimmedVideoPath)
                        .addInput(trimmedAudioPath)
                        .output(outputVideoPath)
                        .on('end', () => {
                            // Send the final video file to the client
                            res.sendFile(path.resolve(outputVideoPath), err => {
                                if (err) {
                                    console.error('Error sending video file:', err);
                                    res.status(500).send('Error sending video file');
                                }

                                // Delete temporary files
                                fs.unlink(videoFile.path, err => {
                                    if (err) console.error('Error deleting video file:', err);
                                });
                                fs.unlink(audioFile.path, err => {
                                    if (err) console.error('Error deleting audio file:', err);
                                });
                                fs.unlink(trimmedVideoPath, err => {
                                    if (err) console.error('Error deleting trimmed video file:', err);
                                });
                                fs.unlink(trimmedAudioPath, err => {
                                    if (err) console.error('Error deleting trimmed audio file:', err);
                                });
                                fs.unlink(outputVideoPath, err => {
                                    if (err) console.error('Error deleting output video file:', err);
                                });
                            });
                        })
                        .on('error', (err) => {
                            console.error('Error combining video and audio:', err);
                            res.status(500).send('Error combining video and audio');
                        })
                        .run();
                })
                .on('error', (err) => {
                    console.error('Error trimming audio:', err);
                    res.status(500).send('Error trimming audio');
                })
                .run();
        })
        .on('error', (err) => {
            console.error('Error trimming video:', err);
            res.status(500).send('Error trimming video');
        })
        .run();
}

// *********PDF Summarizer*********

const summarizeText=require("../utils.js/summarizePdf")
exports.uploadAndSummarize = async (req, res) => {
  const filePath = req.file.path;
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    const language = req.body.language || 'English'

    const summary = await summarizeText(text,language);

    res.send({ summary });

    // Optionally, delete the file after extraction
    fs.unlinkSync(filePath);
  } catch (error) {
    fs.unlinkSync(filePath);
    res.status(500).send({ error: `Error processing the PDF: ${error.message} `});
  }
};

// *******Chat with PDF***********

const chatWithPdf=require("../utils.js/chatPdf")
exports.chatWithPdf = async (req, res) => {
  const filePath = req.file.path;

  try {
      const dataBuffer = fs.readFileSync(filePath);
      const { text } = await pdfParse(dataBuffer);

      const userQuestion = req.body.question;
      const answer = await chatWithPdf(text, userQuestion);

      res.send({ answer });

      // Optionally, delete the uploaded file after processing
      fs.unlinkSync(filePath);
  } catch (error) {
      console.error(error);
      fs.unlinkSync(filePath);
      res.status(500).send({ error: 'Error processing the PDF and answering the question.' });
  }
};


// ******video to audio translation******

const {convertToMP3, transcribe, translate, textToSpeech}=require("../utils.js/languageTranslation")

exports.languageTranslation=async(req,res)=>{
  const videoPath = req.file.path;
  const audioPath = `uploads/${Date.now()}_audio.mp3`;
  const targetLanguage = req.body.targetLanguage 
  const voiceTone = req.body.voiceTone || 'shimmer'; 

  try {
    await convertToMP3(videoPath, audioPath);

    // Transcribe the audio
    const transcription = await transcribe(audioPath);
    let textToConvert=transcription.text;
    // Translate the transcribed text
    if (targetLanguage) {
      textToConvert = await translate(transcription.text, targetLanguage);
    }
   

    // Convert text to audio using TTS-1
    const audioFilePath = await textToSpeech(textToConvert, voiceTone);

    // Provide download link to the user
    res.download(audioFilePath, 'generated_audio.mp3', (err) => {
      if (err) {
        throw new Error(`Download failed: ${err.message}`);
      }

      // Clean up files
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
      if (fs.existsSync(audioFilePath)) {
        fs.unlinkSync(audioFilePath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// ********Translate Audio into other Language*********

const {convertMP3, transcribeaudio, translatetext, textTospeech }=require("../utils.js/audioTranslate")

exports.audioTranslate=async(req,res)=>{
  const audioPath = req.file.path;
  const mp3Path = `uploads/${Date.now()}_audio.mp3`;
  const targetLanguage = req.body.targetLanguage || 'en'; // Default to English if not provided
  const voiceTone = req.body.voiceTone || 'en_us_male'; // Default voice tone

  try {
    // Convert uploaded audio to MP3
    await convertMP3(audioPath, mp3Path);

    // Transcribe the MP3 audio
    const transcription = await transcribeaudio(mp3Path);

    // Translate the transcribed text
    const translatedText = await translatetext(transcription.text, targetLanguage);

    // Convert text to audio using TTS-1
    const audioFilePath = await textTospeech(translatedText, voiceTone);

    // Provide download link to the user
    res.download(audioFilePath, 'translated_audio.mp3', (err) => {
      if (err) {
        throw new Error(`Download failed: ${err.message}`);
      }

      // Clean up files
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
      if (fs.existsSync(mp3Path)) {
        fs.unlinkSync(mp3Path);
      }
      if (fs.existsSync(audioFilePath)) {
        fs.unlinkSync(audioFilePath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// **********Video Translation ************
const {extractConvertToMP3,transcribe_Audio,translateTheText,text_To_Speech,merge_Audio_With_Video}=require("../utils.js/videoTranslator")
exports.videoTranlator=async(req,res)=>{
  const videoPath = req.file.path;
  const audioPath = `uploads/${Date.now()}_audio.mp3`;
  const finalVideoPath = `uploads/${Date.now()}_final_video.mp4`;
  const targetLanguage = req.body.targetLanguage || 'en';
  const voiceTone = req.body.voiceTone || 'shimmer';

  try {
    await extractConvertToMP3(videoPath, audioPath);

    const transcription = await transcribe_Audio(audioPath);
    const translatedText = await translateTheText(transcription.text, targetLanguage);
    const generatedAudioPath = await text_To_Speech(translatedText, voiceTone);

    await merge_Audio_With_Video(videoPath, generatedAudioPath, finalVideoPath);

    res.download(finalVideoPath, 'translated_video.mp4', (err) => {
      if (err) {
        throw new Error(`Download failed: ${err.message}`);
      }

      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      if (fs.existsSync(generatedAudioPath)) fs.unlinkSync(generatedAudioPath);
      if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// ********Youtube Translator******

const {ytdldownloadAndMerge,ytdlextractAndConvertToMP3,ytdltranscribeAudio,ytdltranslateText,ytdltextToSpeech,ytdlmergeAudioWithVideo}=require("../utils.js/youtubeTranslator")
const uploadDir = path.resolve(__dirname, 'uploads');
// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.youtubeTranslator=async(req,res)=>{
  const { url, targetLanguage, voiceTone } = req.body;
    const videoOutputPath = uploadDir;
    const audioPath = path.resolve(uploadDir, `${Date.now()}_audio.mp3`);
    const finalVideoPath = path.resolve(uploadDir, `${Date.now()}_final_video.mp4`);

    try {
        console.log('Starting download and translation process...');
        const downloadedVideoPath = await ytdldownloadAndMerge(url, videoOutputPath);

        await ytdlextractAndConvertToMP3(downloadedVideoPath, audioPath);

        const transcription = await ytdltranscribeAudio(audioPath);
        const translatedText = await ytdltranslateText(transcription.text, targetLanguage);
        const generatedAudioPath = await ytdltextToSpeech(translatedText, voiceTone);

        await ytdlmergeAudioWithVideo(downloadedVideoPath, generatedAudioPath, finalVideoPath);

        console.log('Sending translated video to client...');
        res.download(finalVideoPath, 'translated_video.mp4', (err) => {
            if (err) {
                throw new Error(`Download failed: ${err.message}`);
            }

            // Clean up files after download
            if (fs.existsSync(downloadedVideoPath)) fs.unlinkSync(downloadedVideoPath);
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
            if (fs.existsSync(generatedAudioPath)) fs.unlinkSync(generatedAudioPath);
            if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}



// ***********Finance Advisor***************
const getFinancialAdvice=require("../utils.js/financeAdvisor")
exports.financeadvisor = async (req, res) => {
  const { description, amount,language,outputCount } = req.body;

    try {
        const advice = await getFinancialAdvice(description, amount,language,outputCount);
        res.json({ advice });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while generating advice.' });
    }
};


// ************Ai Detector**************

exports.AiDetector = async(req,res)=>{
  const { text } = req.body;
  try {
    const result = await detectAIContent(text);
    res.send({ result });
} catch (error) {
    res.status(500).send({ error: error.message });
}

}


// news summerizer

const summarizeNewsArticle=require("../utils.js/newsSummary")
exports.newsSummerizer= async(req,res)=>{
  const {articleText,languageCode,output} =req.body
  try {
    const summary = await summarizeNewsArticle(articleText,languageCode,output);
    // console.log('Summarized Article:');
    // console.log(summary);
    res.send(summary)
} catch (error) {
    console.error('Error:', error);
}
}


// ***Text InfoGraphic*****

const { generateInfographicText } = require("../utils.js/textInfographicGenerator");

exports.generateTextInfographic = async (req, res) => {
    const { topic, sections,tone,nOutputs,language } = req.body;

    try {
        const infographicText = await generateInfographicText(topic, sections,tone,nOutputs,language );
        
        res.status(200).json({ infographicText });
    } catch (error) {
        console.error('Error generating infographic text:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// ************Avatar creation************
const axios = require('axios');

function generateCustomAvatar(options) {
  const baseUrl = 'https://avataaars.io/';
  const params = new URLSearchParams(options).toString();
  return `${baseUrl}?${params}`;
}

exports.createAvatar = async (req, res) => {
  try {
    const options = {
      avatarStyle: req.query.avatarStyle || 'Circle',
      topType: req.query.topType || 'ShortHairShortFlat',
      accessoriesType: req.query.accessoriesType || 'Blank',
      hairColor: req.query.hairColor || 'BrownDark',
      facialHairType: req.query.facialHairType || 'Blank',
      facialHairColor: req.query.facialHairColor || 'BrownDark',
      clotheType: req.query.clotheType || 'BlazerShirt',
      clotheColor: req.query.clotheColor || 'Red',
      eyeType: req.query.eyeType || 'Default',
      eyebrowType: req.query.eyebrowType || 'Default',
      mouthType: req.query.mouthType || 'Default',
      skinColor: req.query.skinColor || 'Light',
      hatColor: req.query.hatColor || 'White'
    };
    const avatarUrl = generateCustomAvatar(options);
    // console.log(avatarUrl)
    const imageResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });

    const buffer = Buffer.from(imageResponse.data);
    const jpegBuffer = await sharp(buffer).jpeg().toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(jpegBuffer);
  } catch (error) {
    console.error('Error downloading avatar:', error);
    res.status(500).send('Error downloading avatar. Please try again later.');
  }
};



// *******Image Compressor********

const fsPromises = require('fs').promises; 

exports.compressImage = async (req, res) => {
  try {
      const files = req.files;
      const compressedImages = [];

      // Loop through each uploaded file and compress
      for (const file of files) {
          const fileBuffer = await fsPromises.readFile(file.path);
          const compressedImage = await sharp(fileBuffer)
              .rotate() 
              .resize({ width: 800 }) // Adjust the width as needed
              .jpeg({ quality: 70 })  // Adjust the quality as needed
              .toBuffer();

          compressedImages.push({
              originalname: file.originalname,
              buffer: compressedImage
          });

          // Delete the original file after compression
          await fsPromises.unlink(file.path);
      }

      // Create a zip archive
      const zipFilePath = path.join(__dirname, 'compressed_images.zip');
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
          zlib: { level: 9 }  // Compression level
      });

      // Archive error handling
      archive.on('error', (err) => {
          throw err;
      });

      // Pipe archive to the output file stream
      archive.pipe(output);

      // Append each compressed image to the archive
      compressedImages.forEach((image) => {
          archive.append(image.buffer, { name: image.originalname });
      });

      // Finalize the archive (done appending)
      await archive.finalize();

      // Send the zip file as a response after finalization
      output.on('close', () => {
          res.set('Content-Type', 'application/zip');
          res.download(zipFilePath, 'compressed_images.zip', async (err) => {
              if (err) {
                  console.error('Error sending the zip file:', err);
              } else {
                  // Delete the zip file after it is sent to the client
                  await fsPromises.unlink(zipFilePath);
              }
          });
      });
  } catch (error) {
      console.error('Error compressing images:', error);
      res.status(500).json({ error: 'Error compressing images.' });
  }
};

// **********SWOT Analysis Generator**********


// controllers/swotController.js

const { generateSWOTAnalysis, generateSEOSuggestions,generateSEOImprovements, generateSEOAudit, generateCompetitorAnalysis } = require('../utils.js/swotAnalysis');

exports.generateSWOT = async (req, res) => {
    try {
        const { topic,language,outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for SWOT analysis' });
        }

        const swotAnalysis = await generateSWOTAnalysis(topic,language,outputCount);

        res.status(200).json( swotAnalysis );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating SWOT analysis' });
    }
};



// *************Cover Letter*********


const getCoverLetter = require('../utils.js/getCoverLetter');

exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobDescription, userDetails, highlights,language,outputCount } = req.body;
    const coverLetter = await getCoverLetter(jobDescription, userDetails, highlights,language,outputCount);
    res.status(200).json( coverLetter );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating cover letter" });
  }
};

// ***************Logo Generator***************

const { generateLogoImage, Quality }=require("../utils.js/generateLogo")
exports.generateLogo = async (req, res) => {
  try {
      const companyName = req.body.companyName;
      const companyType = req.body.companyType;
      const design = req.body.design || "";
      
      const quality = req.body.quality || Quality.STANDARD;
      // check quality is valid
      if (!Object.values(Quality).includes(quality)) {
          response_500(res, "Invalid quality", null);
          return;
      }

      const prompt = `Create a logo for a ${companyType} company named "${companyName}". The logo must prominently feature the company name "${companyName}". ${design ? `Please incorporate the following design elements: ${design}.` : ''}`;

      
      const response = await generateLogoImage(prompt, quality);
      response_200(res, "Logo generated successfully", response.url);
  } catch (error) {
      response_500(res, "Error generating logo", error);
  }
};


// youtube video download using ytdl


const DOWNLOAD_FOLDER = path.resolve(__dirname, '../downloads');
const FILE_EXPIRATION_TIME = 60000;

exports.downloadytdl=async(req,res)=>{
  const { url } = req.body;
    try {
        const convertedFilePath = await downloadAndMerge(url, DOWNLOAD_FOLDER);
        const fileName = path.basename(convertedFilePath);
        const downloadUrl = `${req.protocol}://${req.get('host')}/downloads/${fileName}`;

        // Set a timer to delete the file after a certain period
        setTimeout(() => {
            fs.unlink(convertedFilePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${convertedFilePath}`, err);
                } else {
                    console.log(`File deleted: ${convertedFilePath}`);
                }
            });
        }, FILE_EXPIRATION_TIME);

        res.status(200).send({ downloadUrl });
    } catch (error) {
        console.error('Error during the download process:', error);
        res.status(400).send({ error: error.message });
    }
}


// -----------LinkedinPost Generator-------------
const { generateLinkedInPostContent } = require('../utils.js/linkedinPostGenerator');

exports.generateLinkedInPost = async (req, res) => {
    try {
        const { topic, content, tone, language, outputCount } = req.body;

        if (!topic || !content) {
            return res.status(400).json({ error: 'Please provide a topic and content for LinkedIn post' });
        }

        const linkedinPosts = await generateLinkedInPostContent(topic, content, tone, language, outputCount);

        res.status(200).json(linkedinPosts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating LinkedIn post' });
    }
};


// -----------Linkedin Bio Generator------------

const { generateLinkedInBioContent } = require('../utils.js/linkedinBioGenerator');

exports.generateLinkedInBio = async (req, res) => {
    try {
        const { name, profession, experience, tone, language, outputCount } = req.body;

        if (!name || !profession || !experience) {
            return res.status(400).json({ error: 'Please provide name, profession, and experience for LinkedIn bio' });
        }

        const linkedinBios = await generateLinkedInBioContent(name, profession, experience, tone, language, outputCount);

        res.status(200).json(linkedinBios);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating LinkedIn bio' });
    }
};


// ----------------Linkedin Recommedation Generator---------

const { generateLinkedInRecommendationContent } = require('../utils.js//linkedinRecommedation');

exports.generateLinkedInRecommendation = async (req, res) => {
    try {
        const { name, relationship, skills, accomplishments, tone, language, outputCount } = req.body;

        if (!name || !relationship || !skills || !accomplishments) {
            return res.status(400).json({ error: 'Please provide name, relationship, skills, and accomplishments for LinkedIn recommendation' });
        }

        const linkedinRecommendations = await generateLinkedInRecommendationContent(name, relationship, skills, accomplishments, tone, language, outputCount);

        res.status(200).json(linkedinRecommendations);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating LinkedIn recommendation' });
    }
};

// -------Linkedin Connection Request Message Generator---------

const { generateConnectionRequestContent } = require('../utils.js/linkedinConnectionRequest');

exports.generateConnectionRequest = async (req, res) => {
    try {
        const { name, reason, tone, language, outputCount } = req.body;

        if (!name || !reason) {
            return res.status(400).json({ error: 'Please provide name and reason for connection request' });
        }

        const connectionRequests = await generateConnectionRequestContent(name, reason, tone, language, outputCount);

        res.status(200).json(connectionRequests);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating connection request message' });
    }
};


// ---------Youtube Downloader-----------

const { ytdown } = require('nayan-media-downloader');
exports.youtubeDownloader=async(req,res)=>{
  try {
    const videoUrl = req.query.url; // Assuming the URL is passed as a query parameter
    const result = await ytdown(videoUrl);

    res.json({
        status: true,
        data: result
    });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
          status: false,
          message: 'Failed to download video'
      });
  }

}

// ------------About me generator-----------------

const aboutMeGenerator=require("../utils.js/aboutMeGenerator")

exports.aboutMe=async(req,res)=>{
try {
const {personalInfo, outputLength, tone, language, outputCount} = req.body;
if (!personalInfo || !outputLength || !tone || !language ||!outputCount) {
return res.status(400).json({ error: 'Please provide infomation for connection request' });
}
const connectionRequests = await aboutMeGenerator(personalInfo, outputLength, tone, language, outputCount);
res.status(200).json(connectionRequests);
} catch (error) {
  console.error('Error generating connection request content:', error);
  return 'Failed to generate connection request content';
}
}

// -------------------tiktok video caption generator
const tiktokCaptionGenerator=require("../utils.js/tiktokVideoCaptionGenerator")

exports.tiktokCaptionGenerate=async(req,res)=>{
  try {
    const {videoDescription, tone, language, outputCount}=req.body;
    if (!videoDescription || !tone || !language ||!outputCount) {
      return res.status(400).json({ error: 'Please provide infomation for connection request' });
      }
  const connectionRequests = await tiktokCaptionGenerator(videoDescription, tone, language, outputCount);
  res.status(200).json(connectionRequests);


  } catch (error) {
  console.error('Error generating About Me content:', error);
  res.status(500).send('Failed to generate About Me content');
  }
}


// -------Title Generator-----
const { generateAttentionGrabbingTitle } = require('../utils.js/AtentionTitleGenerator');

exports.generateTitle = async (req, res) => {
    try {
        const { topic, keywords, targetAudience, tone, language, outputCount } = req.body;

        if (!topic || !keywords || !targetAudience) {
            return res.status(400).json({ error: 'Please provide topic, keywords, and target audience for title generation' });
        }

        const titles = await generateAttentionGrabbingTitle(topic, keywords, targetAudience, tone, language, outputCount);

        res.status(200).json(titles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating titles' });
    }
};

// --------Youtube Video Title Generator-------

const { generateYouTubeVideoTitle } = require('../utils.js/youtubeVideoTitle');

exports.generateVideoTitle = async (req, res) => {
    try {
        const { topic, keywords, targetAudience, tone, language, outputCount } = req.body;

        if (!topic || !keywords || !targetAudience) {
            return res.status(400).json({ error: 'Please provide topic, keywords, and target audience for title generation' });
        }

        const titles = await generateYouTubeVideoTitle(topic, keywords, targetAudience, tone, language, outputCount);

        res.status(200).json(titles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating titles' });
    }
};

// ------Youtube Videos ideas------

const { generateYouTubeVideoIdeas } = require('../utils.js/youtubeVideoIdeas');

exports.generateVideoIdeas = async (req, res) => {
    try {
        const { topic, tone, language, outputCount } = req.body;

        if (!topic || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: topic, tone, language, outputCount' });
        }

        const videoIdeas = await generateYouTubeVideoIdeas(topic, tone, language, outputCount);

        res.status(200).json(videoIdeas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating YouTube video ideas' });
    }
};

// --------Youtube script outline generator--------
const { generateScriptOutline } = require('../utils.js/youtubeOutline');

exports.generateScriptOutline = async (req, res) => {
    try {
        const { topic, tone, language, outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for the script outline' });
        }

        const scriptOutlines = await generateScriptOutline(topic, tone, language, outputCount);

        res.status(200).json(scriptOutlines);
    } catch (error) {
        console.error('Error generating script outline:', error);
        res.status(500).json({ error: 'Error generating script outline' });
    }
};

// ---------------Content Content generator

const contentCalendarGenerator=require("../utils.js/ContentCalenderGenerator")

exports.CalenderContentGenerator=async(req,res)=>{
  try {
    const {topic, tone, language, outputCount}=req.body;
    if(!topic){
      return res.status(400).json({error:"Please provide a topic for generate resposne"})
    }
    const data=await contentCalendarGenerator(topic, tone, language, outputCount)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error content Calendar Generator:', error);
        res.status(500).json({ error: 'Error generating content' });
  }
}

const tiktokHashtagsGenerator=require("../utils.js/tiktokHastagGenerator")
exports.tiktokhastag=async(req,res)=>{
  try {
    const {videoDescription, tone, language, outputCount}=req.body
    if(!videoDescription){
      return res.status(400).json({error:"Please provide a video description for generate respose"})
    }
    const data=await tiktokHashtagsGenerator(videoDescription, tone, language, outputCount)
    res.status(200).json(data);
  } catch (error) {
    console.error('Error Generating tiktok hastag:', error);
    res.status(500).json({ error: 'Error generating hastag' });
  }
}

// --------Reel Script Generator-------
const { generateReelScript } = require('../utils.js/reelScriptGenerator');

exports.generateReelScript = async (req, res) => {
    try {
        const { topic, tone, language, outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for the reel script' });
        }

        const reelScripts = await generateReelScript(topic, tone, language, outputCount);

        res.status(200).json(reelScripts);
    } catch (error) {
        console.error('Error generating reel script:', error);
        res.status(500).json({ error: 'Error generating reel script' });
    }
};

// ------Reel Ideas Generator----------
const { generateReelIdeas } = require('../utils.js/reelIdeasGenerator');

exports.generateReelIdeas = async (req, res) => {
    try {
        const { topic, tone, language, outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for reel ideas' });
        }

        const reelIdeas = await generateReelIdeas(topic, tone, language, outputCount);

        res.status(200).json(reelIdeas);
    } catch (error) {
        console.error('Error generating reel ideas:', error);
        res.status(500).json({ error: 'Error generating reel ideas' });
    }
};

// --------About Company Page Generator---------
const { generateAboutCompany } = require('../utils.js/aboutCompany');

exports.generateAboutCompanyPage = async (req, res) => {
    try {
        const { companyName, industry, mission, values, tone, language, outputCount } = req.body;

        if (!companyName || !industry || !mission || !values) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const aboutCompanyPages = await generateAboutCompany(companyName, industry, mission, values, tone, language, outputCount);

        res.status(200).json(aboutCompanyPages);
    } catch (error) {
        console.error('Error generating About Company page:', error);
        res.status(500).json({ error: 'Error generating About Company page' });
    }
};

// ---------Tweet Reply Generator-------
const { generateReply } = require('../utils.js/tweetReplyGenerator');

exports.generateTweetReply = async (req, res) => {
    try {
        const { tweetContent, userHandle, tone, language, outputCount } = req.body;

        if (!tweetContent || !userHandle || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const tweetReplies = await generateReply(tweetContent, userHandle, tone, language, outputCount);

        res.status(200).json(tweetReplies);
    } catch (error) {
        console.error('Error generating tweet reply:', error);
        res.status(500).json({ error: 'Error generating tweet reply' });
    }
};

// ------------Social Media Post Generator---------
const { generatePost } = require('../utils.js/socialMediaPostGenerator');

exports.generateSocialMediaPost = async (req, res) => {
    try {
        const { platform, topic, keywords, tone, language, outputCount } = req.body;

        if (!platform || !topic || !keywords || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const socialMediaPosts = await generatePost(platform, topic, keywords, tone, language, outputCount);

        res.status(200).json(socialMediaPosts);
    } catch (error) {
        console.error('Error generating social media post:', error);
        res.status(500).json({ error: 'Error generating social media post' });
    }
};


// ------Bullet points generatro----
const { generateBulletPointsContent } = require('../utils.js/bulletPointsUtils');

exports.generateBulletPoints = async (req, res) => {
    try {
        const { topic, language, tone, outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for generating bullet points.' });
        }

        const bulletPoints = await generateBulletPointsContent(topic, language, tone, outputCount);

        res.status(200).json(bulletPoints);
    } catch (error) {
        console.error('Error generating bullet points:', error);
        res.status(500).json({ error: 'Error generating bullet points' });
    }
};

// ---------Event Name Generator--------
const { generateEventNameUtil } = require('../utils.js/eventName');

exports.generateEventName = async (req, res) => {
    try {
        const { topic, language, outputCount } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Please provide a topic for the event name' });
        }

        const eventNames = await generateEventNameUtil(topic, language, outputCount);

        res.status(200).json(eventNames);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating event names' });
    }
};

// -------Professional Bio Generator----------
const { generateBioUtil } = require('../utils.js/professionalBioGenerator');

exports.generateProfessionalBio = async (req, res) => {
    try {
        const { name, profession, achievements, tone, language, outputCount } = req.body;

        if (!name || !profession) {
            return res.status(400).json({ error: 'Please provide a name and profession' });
        }

        const bios = await generateBioUtil(name, profession, achievements, tone, language, outputCount);

        res.status(200).json(bios);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating bio' });
    }
};

// --------SEO Content Brief-------
const { generateSeoBriefUtil } = require('../utils.js/seoBriefGenerator');

exports.generateSeoBrief = async (req, res) => {
    try {
        const { topic, keywords, targetAudience, language, tone, outputCount } = req.body;

        if (!topic || !keywords || !targetAudience) {
            return res.status(400).json({ error: 'Please provide a topic, keywords, and target audience' });
        }

        const seoBriefs = await generateSeoBriefUtil(topic, keywords, targetAudience, language, tone, outputCount);

        res.status(200).json(seoBriefs);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating SEO content brief' });
    }
};

// -------Company Profile Generator-------
const { generateCompanyProfileUtil } = require('../utils.js/companyProfile');

exports.generateCompanyProfile = async (req, res) => {
    try {
        const { companyName, industry, services, mission, vision, targetAudience, language, tone, outputCount } = req.body;

        if (!companyName || !industry || !services || !mission || !vision || !targetAudience) {
            return res.status(400).json({ error: 'Please provide all required fields: companyName, industry, services, mission, vision, targetAudience' });
        }

        const companyProfiles = await generateCompanyProfileUtil(companyName, industry, services, mission, vision, targetAudience, language, tone, outputCount);

        res.status(200).json(companyProfiles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating company profile' });
    }
};

// ---------Invitation Email--------
const { generateEventInvitationEmailUtil } = require('../utils.js/eventInvitation');

exports.generateEventInvitationEmail = async (req, res) => {
    try {
        const { eventName, eventDate, eventLocation, eventDescription, recipientName, senderName, language, tone, outputCount } = req.body;

        if (!eventName || !eventDate || !eventLocation || !eventDescription || !recipientName || !senderName || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: eventName, eventDate, eventLocation, eventDescription, recipientName, senderName, outputCount' });
        }

        const eventInvitationEmails = await generateEventInvitationEmailUtil(eventName, eventDate, eventLocation, eventDescription, recipientName, senderName, language, tone, outputCount);

        res.status(200).json(eventInvitationEmails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating event invitation email' });
    }
};

// ------------Tinder bio generator

const { generateTinderBioUtil } = require('../utils.js/tinderBioGenerator');

exports.generateTinderBio = async (req, res) => {
    try {
        const { personalityTraits, interests, tone, language, outputCount } = req.body;

        if (!personalityTraits || !interests || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: personalityTraits, interests, tone, language, outputCount' });
        }

        const bios = await generateTinderBioUtil(personalityTraits, interests, tone, language, outputCount);

        res.status(200).json(bios);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Tinder bios' });
    }
};


// -----Event Remainder email

const { generateEventReminderEmailUtil } = require('../utils.js/eventReminderEmail');

exports.generateEventReminderEmail = async (req, res) => {
    try {
        const { eventName, eventDate, recipientName, tone, language, outputCount } = req.body;

        if (!eventName || !eventDate || !recipientName || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: eventName, eventDate, recipientName, tone, language, outputCount' });
        }

        const emails = await generateEventReminderEmailUtil(eventName, eventDate, recipientName, tone, language, outputCount);

        res.status(200).json(emails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating event reminder emails' });
    }
};

// ---------Instagram Hashtag generator-----------
const { generateInstagramHashtagsUtil } = require('../utils.js/instagramHashtag');

exports.generateInstagramHashtags = async (req, res) => {
    try {
        const { topic, language, outputCount } = req.body;

        if (!topic || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: topic, language, outputCount' });
        }

        const hashtags = await generateInstagramHashtagsUtil(topic, language, outputCount);

        res.status(200).json(hashtags);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Instagram hashtags' });
    }
};

// ------Follow up Email Generator--------
const { generateFollowUpEmailUtil } = require('../utils.js/followUpEmail');

exports.generateFollowUpEmail = async (req, res) => {
    try {
        const { mailReceived, purposeOfFollowUpEmail, tone, language, outputCount } = req.body;

        if (!mailReceived || !purposeOfFollowUpEmail || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: mailReceived, purposeOfFollowUpEmail, tone, language, outputCount' });
        }

        const followUpEmails = await generateFollowUpEmailUtil(mailReceived, purposeOfFollowUpEmail, tone, language, outputCount);

        res.status(200).json(followUpEmails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating follow-up emails' });
    }
};

// -------------Job Offer letter genrator

const { generateJobOfferLetterContent } = require('../utils.js/JobOfferLetterGenerator');

exports.generateJobOfferLetter = async (req, res) => {
    try {
        const { recipientName, position, companyName, startDate, salary, tone, language, outputCount } = req.body;

        if (!recipientName || !position || !companyName || !startDate || !salary) {
            return res.status(400).json({ error: 'Please provide all required fields for the job offer letter' });
        }

        const jobOfferLetters = await generateJobOfferLetterContent(recipientName, position, companyName, startDate, salary, tone, language, outputCount);

        res.status(200).json(jobOfferLetters);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating job offer letter' });
    }
};

// -----------Resume Skills Generator

const { generateResumeSkillsContent } = require('../utils.js/ResumeSkillsGenerator');

exports.generateResumeSkills = async (req, res) => {
    try {
        const { profession, experienceLevel, industry, tone, language, outputCount } = req.body;

        if (!profession || !experienceLevel || !industry) {
            return res.status(400).json({ error: 'Please provide all required fields for generating resume skills' });
        }

        const resumeSkills = await generateResumeSkillsContent(profession, experienceLevel, industry, tone, language, outputCount);

        res.status(200).json(resumeSkills);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating resume skills' });
    }
};

//------------------ Elevator Pitch Generator
const { generateElevatorPitchContent } = require('../utils.js/ElevatorPitchGenerator');

exports.generateElevatorPitch = async (req, res) => {
    try {
        const { name, profession, targetAudience, uniqueSellingPoint, tone, language, outputCount } = req.body;

        if (!name || !profession || !targetAudience || !uniqueSellingPoint) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the elevator pitch' });
        }

        const elevatorPitches = await generateElevatorPitchContent(name, profession, targetAudience, uniqueSellingPoint, tone, language, outputCount);

        res.status(200).json(elevatorPitches);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating elevator pitch' });
    }
};

// ---------Email Subject line---------
const { generateEmailSubjectLineUtil } = require('../utils.js/generateEmailSubjectLine');

exports.generateEmailSubjectLine = async (req, res) => {
    try {
        const { emailPurpose, tone, language, outputCount } = req.body;

        if (!emailPurpose || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: emailPurpose, tone, language, outputCount' });
        }

        const subjectLines = await generateEmailSubjectLineUtil(emailPurpose, tone, language, outputCount);

        res.status(200).json(subjectLines);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating email subject lines' });
    }
};

// ---------Review Response Generator----------
const { generateReviewResponseUtil } = require('../utils.js/reviewResponse');

exports.generateReviewResponse = async (req, res) => {
    try {
        const { reviewText, responseTone, language, outputCount } = req.body;

        if (!reviewText || !responseTone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: reviewText, responseTone, language, outputCount' });
        }

        const reviewResponses = await generateReviewResponseUtil(reviewText, responseTone, language, outputCount);

        res.status(200).json(reviewResponses);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating review responses' });
    }
};
// ------Job Description Generator---------
const { generateJobDescriptionUtil } = require('../utils.js/jobDescription');

exports.generateJobDescription = async (req, res) => {
    try {
        const { jobTitle, responsibilities, qualifications, companyInfo, tone, language, outputCount } = req.body;

        if (!jobTitle || !responsibilities || !qualifications || !companyInfo || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: jobTitle, responsibilities, qualifications, companyInfo, tone, language, outputCount' });
        }

        const jobDescriptions = await generateJobDescriptionUtil(jobTitle, responsibilities, qualifications, companyInfo, tone, language, outputCount);

        res.status(200).json(jobDescriptions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating job descriptions' });
    }
};

// ---Resignation letter generator-------
const { generateResignationLetterUtil } = require('../utils.js/resignationLetter');

exports.generateResignationLetter = async (req, res) => {
    try {
        const { employeeName, position, companyName, lastWorkingDay, reasonForLeaving, tone, language, outputCount } = req.body;

        if (!employeeName || !position || !companyName || !lastWorkingDay || !reasonForLeaving || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: employeeName, position, companyName, lastWorkingDay, reasonForLeaving, tone, language, outputCount' });
        }

        const resignationLetters = await generateResignationLetterUtil(employeeName, position, companyName, lastWorkingDay, reasonForLeaving, tone, language, outputCount);

        res.status(200).json(resignationLetters);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating resignation letters' });
    }
};

// -----Performance Review Generator-----------
const { generatePerformanceReviewUtil } = require('../utils.js/performanceReview');

exports.generatePerformanceReview = async (req, res) => {
    try {
        const { employeeName, position, reviewPeriod, keyAchievements, areasOfImprovement, futureGoals, tone, language, outputCount } = req.body;

        if (!employeeName || !position || !reviewPeriod || !keyAchievements || !areasOfImprovement || !futureGoals || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields: employeeName, position, reviewPeriod, keyAchievements, areasOfImprovement, futureGoals, tone, language, outputCount' });
        }

        const performanceReviews = await generatePerformanceReviewUtil(employeeName, position, reviewPeriod, keyAchievements, areasOfImprovement, futureGoals, tone, language, outputCount);

        res.status(200).json(performanceReviews);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating performance reviews' });
    }
};

// ---------------Call to Action

const { generateCallToActionContent } = require('../utils.js/CallToAction');

exports.generateCallToAction = async (req, res) => {
    try {
        const { targetAudience, purpose, desiredAction, tone, language, outputCount } = req.body;

        if (!targetAudience || !purpose || !desiredAction) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the call to action' });
        }

        const callToActions = await generateCallToActionContent(targetAudience, purpose, desiredAction, tone, language, outputCount);

        res.status(200).json(callToActions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating call to action' });
    }
};

// ---------------Meeting Invitation generator
const { generateMeetingInviteContent } = require('../utils.js/MeetingInvitationGenerator');

exports.generateMeetingInvite = async (req, res) => {
    try {
        const { meetingTitle, date, time, participants, agenda, tone, language, outputCount } = req.body;

        if (!meetingTitle || !date || !time || !participants || !agenda) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the meeting invite' });
        }

        const meetingInvites = await generateMeetingInviteContent(meetingTitle, date, time, participants, agenda, tone, language, outputCount);

        res.status(200).json(meetingInvites);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating meeting invite' });
    }
};

// ------------Project Report Generator---------
const { generateProjectReportContent } = require('../utils.js/ProjectReportGenerator');

exports.generateProjectReport = async (req, res) => {
    try {
        const { projectName, projectDescription, keyMilestones, projectOutcome, length, tone, language, outputCount } = req.body;

        if (!projectName || !projectDescription || !keyMilestones || !projectOutcome || !length || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const projectReports = await generateProjectReportContent(projectName, projectDescription, keyMilestones, projectOutcome, length, tone, language, outputCount);

        res.status(200).json(projectReports);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating project report' });
    }
};

// ----------Google my business product description--------------
const { generateGMBProductDescriptionContent } = require('../utils.js/gmbProductDescription');

exports.generateGMBProductDescription = async (req, res) => {
    try {
        const { productName, productFeatures, targetAudience, language, tone, outputCount } = req.body;

        if (!productName || !productFeatures || !targetAudience || !language || !tone || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const productDescriptions = await generateGMBProductDescriptionContent(productName, productFeatures, targetAudience, language, tone, outputCount);

        res.status(200).json(productDescriptions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating product description' });
    }
};

// -----------Google My business post generator----------
const { generateGMBPostContent } = require('../utils.js/gmbPostGenerator');

exports.generateGMBPost = async (req, res) => {
    try {
        const { businessUpdate, companyName, language, tone, outputCount } = req.body;

        if (!businessUpdate || !companyName || !language || !tone || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const posts = await generateGMBPostContent(businessUpdate, companyName, language, tone, outputCount);

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating GMB post' });
    }
};

// ----------Product description generator----------
const { generateProductDescriptionContent } = require('../utils.js/productDescription');

exports.generateProductDescription = async (req, res) => {
    try {
        const { productName, productFeatures, targetAudience, language, tone, outputCount } = req.body;

        if (!productName || !productFeatures || !targetAudience || !language || !tone || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const descriptions = await generateProductDescriptionContent(productName, productFeatures, targetAudience, language, tone, outputCount);

        res.status(200).json(descriptions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating product descriptions' });
    }
};

// --------------Refrence letter generator

const { generateReferenceLetterContent } = require('../utils.js/ReferenceLetterGenerator');

exports.generateReferenceLetter = async (req, res) => {
    try {
        const { candidateName, relationship, skills, achievements, tone, language, outputCount } = req.body;

        if (!candidateName || !relationship || !skills || !achievements) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the reference letter' });
        }

        const referenceLetters = await generateReferenceLetterContent(candidateName, relationship, skills, achievements, tone, language, outputCount);

        res.status(200).json(referenceLetters);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating reference letter' });
    }
};


// ----------Product Name generator

const { generateProductNameContent } = require('../utils.js/ProductNameGenerator');

exports.generateProductName = async (req, res) => {
    try {
        const { productDescription, targetAudience, tone, language, outputCount } = req.body;

        if (!productDescription || !targetAudience) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the product name' });
        }

        const productNames = await generateProductNameContent(productDescription, targetAudience, tone, language, outputCount);

        res.status(200).json(productNames);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating product name' });
    }
};

// --------Catchy Tagline Generator

const { generateTaglineContent } = require('../utils.js/CatchyTaglineGenerator');

exports.generateCatchyTagline = async (req, res) => {
    try {
        const { productDescription, targetAudience, tone, language, outputCount } = req.body;

        if (!productDescription || !targetAudience) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the catchy tagline' });
        }

        const taglines = await generateTaglineContent(productDescription, targetAudience, tone, language, outputCount);

        res.status(200).json(taglines);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating catchy tagline' });
    }
};


//-------- Business Proposal Generator

const { generateBusinessProposalContent } = require('../utils.js/BusinessProposalGenerator');

exports.generateBusinessProposal = async (req, res) => {
    try {
        const { companyName, projectDescription, objectives, deliverables, timeline, budget, tone, language, outputCount } = req.body;

        if (!companyName || !projectDescription || !objectives || !deliverables || !timeline || !budget) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the business proposal' });
        }

        const proposals = await generateBusinessProposalContent(companyName, projectDescription, objectives, deliverables, timeline, budget, tone, language, outputCount);

        res.status(200).json(proposals);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating business proposal' });
    }
};

// ----------SOP generator

const { generateSOPContent } = require('../utils.js/SOPgenerator');

exports.generateSOP = async (req, res) => {
    try {
        const { applicantName, background, goals, whyThisProgram, tone, language, outputCount } = req.body;

        if (!applicantName || !background || !goals || !whyThisProgram) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the SOP' });
        }

        const sops = await generateSOPContent(applicantName, background, goals, whyThisProgram, tone, language, outputCount);

        res.status(200).json(sops);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating SOP' });
    }
};

// ----------Experiance Letter Generator

const { generateExperienceLetterContent } = require('../utils.js/ExperianceLetterGenerator');

exports.generateExperienceLetter = async (req, res) => {
    try {
        const { employeeName, position, department, duration, achievements, company, tone, language, outputCount } = req.body;

        if (!employeeName || !position || !department || !duration || !achievements || !company) {
            return res.status(400).json({ error: 'Please provide all required fields for generating the experience letter' });
        }

        const experienceLetters = await generateExperienceLetterContent(employeeName, position, department, duration, achievements, company, tone, language, outputCount);

        res.status(200).json(experienceLetters);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating experience letter' });
    }
};

// ---------Motto Generator---------
const { generateMottoContent } = require('../utils.js/mottoGenerator');

exports.generateMotto = async (req, res) => {
    try {
        const { companyName, industry, values, language, tone, outputCount } = req.body;

        if (!companyName || !industry || !values || !language || !tone || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const mottos = await generateMottoContent(companyName, industry, values, language, tone, outputCount);

        res.status(200).json(mottos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating mottos' });
    }
};

// --------Product Brochure--------
const { generateProductBrochureContent } = require('../utils.js/productBrochureGenerator');

exports.generateProductBrochure = async (req, res) => {
    try {
        const { productName, productDescription, features, benefits, language, tone, outputCount } = req.body;

        if (!productName || !productDescription || !features || !benefits || !language || !tone || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const brochures = await generateProductBrochureContent(productName, productDescription, features, benefits, language, tone, outputCount);

        res.status(200).json(brochures);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating product brochure' });
    }
};

// ----------Business Memo Generator----------
const { generateMemoContent } = require('../utils.js/businessMemoGenerator');

exports.generateBusinessMemo = async (req, res) => {
    try {
        const { subject, memoContent, tone, language, outputCount } = req.body;

        if (!subject || !memoContent) {
            return res.status(400).json({ error: 'Please provide a subject and content for the memo' });
        }

        const memos = await generateMemoContent(subject, memoContent, tone, language, outputCount);

        res.status(200).json({ memos });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating business memo' });
    }
};

// --------PAS Framework-----------
const { generatePASContent } = require('../utils.js/pasFramework');

exports.generatePAS = async (req, res) => {
    try {
        const { companyName, productDescription, language, tone, outputCount } = req.body;

        if (!companyName || !productDescription) {
            return res.status(400).json({ error: 'Please provide both company/product name and product description for the PAS framework' });
        }

        const pasContent = await generatePASContent(companyName, productDescription, language, tone, outputCount);

        res.status(200).json(pasContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating PAS content' });
    }
};

// ---------AIDA Framework------------
const { generateAIDAContent } = require('../utils.js/Generateaida');

exports.generateAIDA = async (req, res) => {
    try {
        const { companyName, productDescription, language, tone, outputCount } = req.body;

        if (!companyName || !productDescription) {
            return res.status(400).json({ error: 'Please provide both company/product name and product description for the AIDA framework' });
        }

        const aidaContent = await generateAIDAContent(companyName, productDescription, language, tone, outputCount);

        res.status(200).json(aidaContent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating AIDA content' });
    }
};

// --------------Cold Email Generator-------------
const { generateColdEmails } = require('../utils.js/coldEmail');

exports.generateColdEmail = async (req, res) => {
    try {
        const { recipientName, companyName, yourCompanyName, yourProductService, language, tone, outputCount } = req.body;

        if (!recipientName || !companyName || !yourCompanyName || !yourProductService) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const coldEmails = await generateColdEmails(recipientName, companyName, yourCompanyName, yourProductService, language, tone, outputCount);

        res.status(200).json(coldEmails);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating cold emails' });
    }
};

// -----------Meta Description------------
const { generateMetaDescriptions } = require('../utils.js/metaDescription');

exports.generateMetaDescription = async (req, res) => {
    try {
        const { pageTitle, pageContent, language, tone, outputCount } = req.body;

        if (!pageTitle || !pageContent) {
            return res.status(400).json({ error: 'Please provide both page title and page content' });
        }

        const metaDescriptions = await generateMetaDescriptions(pageTitle, pageContent, language, tone, outputCount);

        res.status(200).json(metaDescriptions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating meta descriptions' });
    }
};

// -----------NewsLetter Name Generator---------------
const { generateNewsletterNames } = require('../utils.js/newsLetterName');

exports.generateNewsletterName = async (req, res) => {
    try {
        const { industry, keywords, tone, audience, language, outputCount } = req.body;

        if (!industry || !keywords || !audience) {
            return res.status(400).json({ error: 'Please provide industry, keywords, and target audience' });
        }

        const newsletterNames = await generateNewsletterNames(industry, keywords, tone, audience, language, outputCount);

        res.status(200).json(newsletterNames);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating newsletter names' });
    }
};

// ----------Job Summary Generator---------
const { generateJobSummaries } = require('../utils.js/jobSummary');

exports.generateJobSummary = async (req, res) => {
    try {
        const { jobTitle, companyName, keyResponsibilities, requirements, location, tone, language, outputCount } = req.body;

        if (!jobTitle || !companyName || !keyResponsibilities || !requirements || !location) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const jobSummaries = await generateJobSummaries(jobTitle, companyName, keyResponsibilities, requirements, location, tone, language, outputCount);

        res.status(200).json(jobSummaries);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating job summaries' });
    }
};

// ---------Job Qualification Generator-----------
const { generateJobQualifications } = require('../utils.js/jobQualifications');

exports.generateJobQualifications = async (req, res) => {
    try {
        const { jobTitle, companyName, responsibilities, tone, language, outputCount } = req.body;

        if (!jobTitle || !companyName || !responsibilities) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const jobQualifications = await generateJobQualifications(jobTitle, companyName, responsibilities, tone, language, outputCount);

        res.status(200).json(jobQualifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating job qualifications' });
    }
};

// -------Job Responsibility Generator----------
const { generateJobResponsibilities } = require('../utils.js/jobResponsibilities');

exports.generateJobResponsibilities = async (req, res) => {
    try {
        const { jobTitle, companyName, tone, language, outputCount } = req.body;

        if (!jobTitle || !companyName) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const jobResponsibilities = await generateJobResponsibilities(jobTitle, companyName, tone, language, outputCount);

        res.status(200).json(jobResponsibilities);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating job responsibilities' });
    }
};

// ---------Subheading Generator-------------
const { generateSubheadings } = require('../utils.js/subHeading');

exports.generateSubheadings = async (req, res) => {
    try {
        const { heading, tone, language, outputCount, context } = req.body;

        if (!heading) {
            return res.status(400).json({ error: 'Please provide a heading' });
        }

        const subheadings = await generateSubheadings({ heading, tone, language, outputCount, context });

        res.status(200).json(subheadings);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating subheadings' });
    }
};

// ----------Unique Value Proposition--------
const { generateUVP } = require('../utils.js/uniqueValue');

exports.generateUVP = async (req, res) => {
    try {
        const { productName, targetAudience, keyBenefit, tone, language, outputCount } = req.body;

        if (!productName || !targetAudience || !keyBenefit) {
            return res.status(400).json({ error: 'Please provide product name, target audience, and key benefit' });
        }

        const uvps = await generateUVP({ productName, targetAudience, keyBenefit, tone, language, outputCount });

        res.status(200).json(uvps);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating UVP' });
    }
};

// -----------OKR generator--------------
const { generateOKR } = require('../utils.js/okrGenerate');

exports.generateOKR = async (req, res) => {
    try {
        const { objective, department, timeFrame, keyResultsCount, tone, language, outputCount } = req.body;

        if (!objective || !department || !timeFrame || !keyResultsCount || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const okrs = await generateOKR({ objective, department, timeFrame, keyResultsCount, tone, language, outputCount });

        res.status(200).json(okrs);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating OKRs' });
    }
};

// ---------Project timeline generator----------
const { generateTimeline } = require('../utils.js/projectTimeline');

exports.generateProjectTimeline = async (req, res) => {
    try {
        const { projectName, projectDescription, startDate, endDate, milestones, tone, language, outputCount } = req.body;

        if (!projectName || !projectDescription || !startDate || !endDate || !milestones || !tone || !language || !outputCount) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const timelines = await generateTimeline({ projectName, projectDescription, startDate, endDate, milestones, tone, language, outputCount });

        res.status(200).json(timelines);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating project timeline' });
    }
};



const FormData = require('form-data');

// Function to call the background removal API
const removeBackground = async (imageUrl, callback) => {
  const form = new FormData();
  form.append('image_url', imageUrl);

  const options = {
    method: 'POST',
    url: 'https://background-removal.p.rapidapi.com/remove',
    headers: {
      'x-rapidapi-key': '1266f65bacmshfbf778aa6f303f1p11a3a1jsne4a8b5e28855',
      'x-rapidapi-host': 'background-removal.p.rapidapi.com',
      ...form.getHeaders()
    },
    data: form
  };

  try {
    const response = await axios(options);
    const backgroundRemovedImageUrl = response.data; // Adjust this based on API response format
    callback(backgroundRemovedImageUrl);
  } catch (error) {
    console.error(`Error removing background: ${error.message}`);
    callback(null);
  }
};

// Controller function to handle the response after image upload and background removal
 exports.uploadImageBG = (req, res) => {
  const imagePath = path.join(__dirname, '../uploads', req.file.originalname);
  const downloadUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`;
  console.log(downloadUrl)

  // Call the background removal API with the image URL
  removeBackground(downloadUrl, (apiRes) => {
    if (apiRes) {
      // Delete the uploaded image file
      res.json({ downloadUrl, backgroundRemovedImageUrl: apiRes });
    }
  });
};

// ---------Statical Generator
const { generateStatisticsContent } = require('../utils.js/StatisticsGenerator');

exports.generateStatistics = async (req, res) => {
    try {
        const { dataset, metrics, tone, language, outputCount } = req.body;

        if (!dataset || !metrics) {
            return res.status(400).json({ error: 'Please provide all required fields for generating statistics' });
        }

        const statistics = await generateStatisticsContent(dataset, metrics, tone, language, outputCount);

        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating statistics' });
    }
};

//------- Digital PR Ideas Generator,

const { generatePRIdeasContent } = require('../utils.js/DigitalPrIdeas');

exports.generatePRIdeas = async (req, res) => {
    try {
        const { companyName, industry, targetAudience, goals, tone, language, outputCount } = req.body;

        if (!companyName || !industry || !targetAudience || !goals) {
            return res.status(400).json({ error: 'Please provide all required fields for generating PR ideas' });
        }

        const prIdeas = await generatePRIdeasContent(companyName, industry, targetAudience, goals, tone, language, outputCount);

        res.status(200).json(prIdeas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating PR ideas' });
    }
};


// -------Meeting Audio Points
const { transcribeAudioMeeting, convertToBulletPoints } = require('../utils.js/MeetingAudioPoints');

exports.transcribeMeeting = async (req, res) => {
    const file = req.file;
    const { language } = req.body; // Extract language from request body

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!language) {
        return res.status(400).json({ error: 'No language specified' });
    }

    const audioPath = path.join(__dirname, '..', file.path);

    try {
        // Transcribe the uploaded audio file
        const text = await transcribeAudioMeeting(audioPath, language, process.env.OPENAI_API_KEY);

        // Convert the transcribed text into bullet points
        const bulletPoints = await convertToBulletPoints(text);

        res.json({ text, bulletPoints });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    } finally {
        // Clean up the uploaded file
        fs.unlinkSync(audioPath);
    }
};


// ----------Pdf To Audio------------


exports.pdfToAudio = async (req, res) => {
  const filePath = req.file.path;

  try {
    // Step 1: Extract text from the PDF
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    if (!data.text) {
      throw new Error('No text found in the PDF.');
    }

    // Step 2: Translate the extracted text
    const targetLanguage = req.body.language || 'en'; // Get the target language from the request, default to English
    const translatedText = await translatetext(data.text, targetLanguage);

    if (!translatedText) {
      throw new Error('Translation failed.');
    }

    // Step 3: Convert the translated text to audio
    const tone = req.body.tone || 'nova'; // Get the tone from the request, or use a default value
    const audioFilePath = await textToSpeech(translatedText, tone);

    // Step 4: Set headers to play audio in the browser
    res.setHeader('Content-Type', 'audio/mpeg');  // Assuming the output format is MP3
    res.setHeader('Content-Disposition', 'inline'); // 'inline' will play the audio in the browser

    // Step 5: Stream the audio to the response
    const audioStream = fs.createReadStream(audioFilePath);
    audioStream.pipe(res);

    // Clean up files after streaming is done
    audioStream.on('end', () => {
      fs.unlinkSync(filePath); // Delete the uploaded PDF file
      fs.unlinkSync(audioFilePath); // Delete the generated audio file
    });

    // Handle errors during streaming
    audioStream.on('error', (streamErr) => {
      console.error('Error streaming audio:', streamErr);
      res.status(500).send({ error: 'Error streaming audio.' });
    });

  } catch (error) {
    // Handle errors during the PDF to audio conversion
    res.status(500).send({ error: `Error converting PDF to audio: ${error.message}` });

    // Clean up files if an error occurs
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};


// --------sign in pdf -------------

const { rgb,degrees } = require('pdf-lib');

exports.pdfSign=async (req,res) => {
  const { path } = req.file;
  try {
    const pdfBytes = fs.readFileSync(path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = 200;
      const textHeight = 50;
      page.drawRectangle({
        x: width - textWidth - 10,
        y: 10,
        width: textWidth,
        height: textHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1.5,
      });
      page.drawText('Signature:', {
        x: width - textWidth,
        y: 30,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync('output.pdf', modifiedPdfBytes);
    res.download('output.pdf');
  } catch (error) {
    res.status(500).send('Error processing PDF');
  } finally {
    fs.unlinkSync(path); // Clean up the uploaded file
  }

}

// ------------Docx to audio---------------
const mammoth = require('mammoth')
exports.docsToAudio = async (req, res) => {
  const filePath = req.file.path;

  try {
    // Step 1: Extract text from the DOCS file
    const { value: extractedText } = await mammoth.extractRawText({ path: filePath });

    if (!extractedText) {
      throw new Error('No text found in the DOCS file.');
    }

    // Step 2: Translate the extracted text
    const targetLanguage = req.body.language || 'en'; // Default to English if no language is specified
    const translatedText = await translatetext(extractedText, targetLanguage);

    if (!translatedText) {
      throw new Error('Translation failed.');
    }

    // Step 3: Convert the translated text to audio
    const tone = req.body.tone || 'nova'; // Use the specified tone or a default value
    const audioFilePath = await textToSpeech(translatedText, tone);

    // Step 4: Set headers to play audio in the browser
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline');

    // Step 5: Stream the audio to the response
    const audioStream = fs.createReadStream(audioFilePath);
    audioStream.pipe(res);

    // Clean up files after streaming is done
    audioStream.on('end', () => {
      fs.unlinkSync(filePath); // Delete the uploaded DOCS file
      fs.unlinkSync(audioFilePath); // Delete the generated audio file
    });

    // Handle errors during streaming
    audioStream.on('error', (streamErr) => {
      console.error('Error streaming audio:', streamErr);
      res.status(500).send({ error: 'Error streaming audio.' });
    });

  } catch (error) {
    // Handle errors during the DOCS to audio conversion
    res.status(500).send({ error: `Error converting DOCS to audio: ${error.message} `});

    // Clean up files if an error occurs
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// -----------Text Extractor from Docx----------
const { Document, Packer, Paragraph, TextRun } = require('docx');

async function createDocxFile(text) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(text)
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

exports.extractText = async (req, res) => {
  const filePath = path.join(__dirname, '..', req.file.path);

  try {
    // Step 1: Extract text from the DOCX file
    const { value: extractedText } = await mammoth.extractRawText({ path: filePath });

    if (!extractedText) {
      throw new Error('No text found in the DOCX file.');
    }

    // Step 2: Translate the extracted text
    const targetLanguage = req.body.language || 'en'; // Default to English if no language is specified
    const translatedText = await translatetext(extractedText, targetLanguage);

    if (!translatedText) {
      throw new Error('Translation failed.');
    }

    // Create a DOCX file with the translated text
    const docxBuffer = await createDocxFile(translatedText);

    // Optionally, delete the uploaded file after processing
    fs.unlinkSync(filePath);

    // Send the DOCX file as a response
    res.setHeader('Content-Disposition', 'attachment; filename=translated.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(docxBuffer);
  } catch (err) {
    // Optionally, delete the uploaded file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).send(`Error processing the DOCX file: ${err.message}`);
  }
};

// --------------Image Prompt Generator------------

// controllers/imagePromptController.js
const { generateImagePromptContent } = require('../utils.js/imagePromptGenerator');

exports.generateImagePrompt = async (req, res) => {
    try {
        const { mainObject, style, feeling, colors, background, language, outputCount } = req.body;

        if (!mainObject || !style || !feeling || !colors || !background || !language || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const prompts = await generateImagePromptContent(mainObject, style, feeling, colors, background, language, outputCount);

        res.status(200).json(prompts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating prompts' });
    }
};


// instagram image and video downloader controller

const instagramGetUrl = require('instagram-url-direct');

exports.instaImageVideoDownloader=async(req,res)=>{
  const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }
  try {
    let links = await instagramGetUrl(url);
        res.send(links);
    
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve URL' });

  }
}


// -----------Instagram Caption Generator--------------
const { generateCaption,generateInstagramBio,generateInstagramStory, generateReelPost, generateThreadsPost, generateFacebookPost, generateFacebookAdHeadline, generateFacebookBio,generateFacebookGroupPost,generateFacebookGroupDescription,FacebookPageDescription,YouTubePostTitle,YouTubePostDescription,TwitterBio,TwitterPost,TwitterThreadsPost,TwitterThreadsBio,LinkedInPageHeadline,LinkedinCompanyPageHeadline,LinkedInPageSummary,LinkedInCompanySummary,PostHashtags,BlogPost,ArticleGenerator,PressRelease,Newsletter,GoogleAdsHeadline,GoogleAdDescription,MarketingPlan,MarketingFunnel,ProductDescription,ArticleIdeas,ArticleOutline,ArticleIntro,BlogIdeas,BlogTitles,BlogOutline,BlogIntro,SEOTitleDescription,PromptGenerator,ReviewReply,VideoScript,generateImageFromPrompt

} = require('../utils.js/generativeTools');

exports.generateCaption = async (req, res) => {
    try {
        const { postDetails, tone, language, outputCount, useEmoji, useHashtags } = req.body;

        if (!postDetails || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const captions = await generateCaption({ postDetails, tone, language, outputCount, useEmoji, useHashtags });

        res.status(200).json(captions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating captions' });
    }
};

// -----------Instagram Bio Generator--------------

exports.generateInstagramBio = async (req, res) => {
    try {
        const { profile, tone, language, outputCount, useEmoji, useHashtags } = req.body;

        if (!profile || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const bios = await generateInstagramBio({ profile, tone, language, outputCount, useEmoji, useHashtags });

        res.status(200).json(bios);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Instagram bios' });
    }
};

// -----------Instagram Story Post Generator--------------

exports.generateInstagramStory = async (req, res) => {
  try {
      const { story, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!story || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const stories = await generateInstagramStory({ story, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(stories);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Instagram stories' });
  }
};

// -----------Instagram Reel Post Generator--------------

exports.generateReelPost = async (req, res) => {
    try {
        const { theme, tone, language, outputCount, useEmoji, useHashtags } = req.body;

        if (!theme || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const posts = await generateReelPost({ theme, tone, language, outputCount, useEmoji, useHashtags });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Reel posts' });
    }
};


// -----------Instagram Threads Post Generator--------------

exports.generateThreadsPost = async (req, res) => {
    try {
        const { theme, tone, language, outputCount, useEmoji, useHashtags } = req.body;

        if (!theme || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const posts = await generateThreadsPost({ theme, tone, language, outputCount, useEmoji, useHashtags });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Threads posts' });
    }
};

// -----------Facebook Post Generator-------------- 

exports.generateFacebookPost = async (req, res) => {
    try {
        const { theme, tone, language, outputCount, useEmoji, useHashtags } = req.body;

        if (!theme || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const posts = await generateFacebookPost({ theme, tone, language, outputCount, useEmoji, useHashtags });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating Facebook posts' });
    }
};

// -----------Facebook Ad Headline Generator--------------

exports.generateFacebookAdHeadline = async (req, res) => {
  try {
      const { brandOrProductName, purpose, businessType, tone, language, outputCount, useEmoji } = req.body;

      if (!brandOrProductName || !purpose || !businessType || !tone || !language || !outputCount || useEmoji === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const headlines = await generateFacebookAdHeadline({ brandOrProductName, purpose, businessType, tone, language, outputCount, useEmoji });

      res.status(200).json(headlines);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Facebook Ad headlines' });
  }
};


// -----------Facebook Bio Generator-------------- 

exports.generateFacebookBio = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await generateFacebookBio({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Facebook bios' });
  }
};

// -----------Facebook Group Post Generator--------------
exports.generateFacebookGroupPost = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await generateFacebookGroupPost({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Facebook group post' });
  }
};
// -----------Facebook Group Discription Generator--------------
exports.generateFacebookGroupDescription = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await generateFacebookGroupDescription({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Facebook group description' });
  }
};


// -----------Facebook Page Discription Generator--------------
exports.generateFacebookPageDescription = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await FacebookPageDescription({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Facebook group description' });
  }
};


exports.generateYouTubePostTitle = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await YouTubePostTitle({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating YouTube Post Title' });
  }
};
exports.generateYouTubePostDescription = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await YouTubePostDescription({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating YouTube Post Title' });
  }
};


exports.generateTwitterBio = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await TwitterBio({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Bio Generator' });
  }
};


exports.generateTwitterPost = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await TwitterPost({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Post' });
  }
};

exports.generateTwitterThreadsPost = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await TwitterThreadsPost({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Threads Post' });
  }
};


exports.generateTwitterThreadsBio = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await TwitterThreadsBio({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Threads Post' });
  }
};

exports.generateLinkedInPageHeadline = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await LinkedInPageHeadline({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Threads Post' });
  }
};


exports.generateLinkedinCompanyPageHeadline = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await LinkedinCompanyPageHeadline({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Threads Post' });
  }
};


exports.generateLinkedInPageSummary = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await LinkedInPageSummary({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Twitter Threads Post' });
  }
};


exports.generateLinkedInCompanySummary = async (req, res) => {
  try {
      const { description, tone, language, outputCount, useEmoji, useHashtags } = req.body;

      if (!description || !tone || !language || !outputCount || useEmoji === undefined || useHashtags === undefined) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await LinkedInCompanySummary({ description, tone, language, outputCount, useEmoji, useHashtags });

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating LinkedIn Company Summary' });
  }
};


exports.generatePostHashtags = async (req, res) => {
  try {
      const { description, language, outputCount} = req.body;

      if (!description|| !language || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await PostHashtags({description, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Post Hashtags' });
  }
};


exports.generateBlogPost = async (req, res) => {
  try {
    // Destructuring request body
    const { 
      title, 
      description, 
      keywords, 
      tone, 
      language, 
      wordCount, 
      includeIntroduction, 
      includeConclusion, 
      outputCount, 
      generateImage 
    } = req.body;

    // Check required fields
    if (!title || !description || !keywords || !tone || !language || !wordCount || !outputCount) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Handle keywords as array or comma-separated string
    const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());

    // Generate blog post
    const posts = await BlogPost({
      title,
      description,
      keywords: keywordArray, // Pass keywords as array
      tone,
      language,
      wordCount,
      includeIntroduction,
      includeConclusion,
      outputCount,
    });

    let imageUrl = null;

    // Conditionally generate image if requested (convert string to boolean)
    if (generateImage === true || generateImage === 'true') {
      try {
        const imageResponse = await generateImageFromPrompt(title);
        imageUrl = imageResponse === 'Failed to generate image' ? null : imageResponse.url;
      } catch (err) {
        console.error('Error generating image:', err);
        imageUrl = null; // Fallback if image generation fails
      }
    }

    // Return the generated blog post and image (if applicable)
    res.status(200).json({ posts, imageUrl });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error generating Blog Post' });
  }
};


exports.generateArticle = async (req, res) => {
  try {
      const {description, tone, language, outputCount,generateImage} = req.body;

      if (!description|| !language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ArticleGenerator({description, tone, language, outputCount});

      let imageUrl = null;

      // Conditionally generate image if requested (convert string to boolean)
      if (generateImage === true || generateImage === 'true') {
        try {
          const imageResponse = await generateImageFromPrompt(description);
          imageUrl = imageResponse === 'Failed to generate image' ? null : imageResponse.url;
        } catch (err) {
          console.error('Error generating image:', err);
          imageUrl = null; // Fallback if image generation fails
        }
      }


      res.status(200).json({ posts, imageUrl });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Article' });
  }
};


exports.generatePressRelease = async (req, res) => {
  try {
      const {organizationName, eventName, tone, language, outputCount,eventDetails,generateImage} = req.body;

      if (!organizationName||!eventName || !language || !outputCount||!tone||!eventDetails) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await PressRelease({organizationName, eventName, tone, language, outputCount,eventDetails});
      let imageUrl = null;

      // Conditionally generate image if requested (convert string to boolean)
      if (generateImage === true || generateImage === 'true') {
        try {
          const imageResponse = await generateImageFromPrompt(eventName);
          imageUrl = imageResponse === 'Failed to generate image' ? null : imageResponse.url;
        } catch (err) {
          console.error('Error generating image:', err);
          imageUrl = null; // Fallback if image generation fails
        }
      }
      // Send response
      res.status(200).json({ posts, imageUrl });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Press Release' });
  }
};


exports.generateNewsletter = async (req, res) => {
  try {
      const {organizationName, event, tone, language, outputCount,generateImage} = req.body;

      if (!organizationName||!event || !language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await Newsletter({organizationName, event, tone, language, outputCount});
      let imageUrl = null;

      // Conditionally generate image if requested (convert string to boolean)
      if (generateImage === true || generateImage === 'true') {
        try {
          const imageResponse = await generateImageFromPrompt(event);
          imageUrl = imageResponse === 'Failed to generate image' ? null : imageResponse.url;
        } catch (err) {
          console.error('Error generating image:', err);
          imageUrl = null; // Fallback if image generation fails
        }
      }

       // Send response
       res.status(200).json({ posts, imageUrl });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Newsletter' });
  }
};


exports.generateGoogleAdsHeadliner = async (req, res) => {
  try {
      const {serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount} = req.body;

      if (!serviceName||!keywordsAndHighlights || !language || !outputCount||!tone||!adPurpose||!businessType) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await GoogleAdsHeadline({serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error GoogleAds Headliner' });
  }
};

exports.generateGoogleAdDescription = async (req, res) => {
  try {
      const {serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount} = req.body;

      if (!serviceName||!keywordsAndHighlights || !language || !outputCount||!tone||!adPurpose||!businessType) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await GoogleAdDescription({serviceName, keywordsAndHighlights, tone, adPurpose, businessType, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error Google Ad Description' });
  }
};


exports.generateMarketingPlan = async (req, res) => {
  try {
      const {describeBusiness, goal, objective, tone, language, outputCount} = req.body;

      if (!describeBusiness||!goal || !language || !outputCount||!tone||!objective) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await MarketingPlan({describeBusiness, goal, objective, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error Marketing Plan' });
  }
};


exports.generateMarketingFunnel = async (req, res) => {
  try {
      const {productOrService, targetAudience, budget, goal, tone, language, outputCount} = req.body;

      if (!productOrService||!goal || !language || !outputCount||!tone||!targetAudience||!budget) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await MarketingFunnel({productOrService, targetAudience, budget, goal, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error Marketing Funnel' });
  }
};


exports.createProductDescription = async (req, res) => {
  try {
      const {description, tone, language, outputCount} = req.body;

      if (!description||!language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ProductDescription({description, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error Product Description' });
  }
};


exports.GenerateArticleIdeas = async (req, res) => {
  try {
      const {topic, tone, language, outputCount} = req.body;

      if (!topic||!language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ArticleIdeas({topic, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Atricle Ideas' });
  }
};


exports.GenerateArticleOutline = async (req, res) => {
  try {
      const {topic, tone, language, outputCount} = req.body;

      if (!topic||!language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ArticleOutline({topic, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Article Outline' });
  }
};


exports.GenerateArticleIntro = async (req, res) => {
  try {
      const {topic, tone, language, outputCount} = req.body;

      if (!topic||!language || !outputCount||!tone) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ArticleIntro({topic, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Article Outline' });
  }
};


exports.GenerateBlogIdeas = async (req, res) => {
  try {
      const {topic, language, outputCount} = req.body;

      if (!topic||!language || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await BlogIdeas({topic, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Blog Ideas' });
  }
};


exports.GenerateBlogTitles = async (req, res) => {
  try {
      const {topic, tone, language, outputCount } = req.body;

      if (!topic||!language||!tone || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await BlogTitles({topic, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Blog Titles' });
  }
};


exports.GenerateBlogOutline = async (req, res) => {
  try {
      const {topic, mainPointsForIntro, tone, language, outputCount } = req.body;

      if (!topic||!language||!tone || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await BlogOutline({topic, mainPointsForIntro, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Blog Outline' });
  }
};


exports.GenerateBlogIntro = async (req, res) => {
  try {
      const {topic, mainPointsForIntro, tone, language, outputCount } = req.body;

      if (!topic||!language||!tone || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await BlogIntro({topic, mainPointsForIntro, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Blog Intro' });
  }
};


exports.GenerateSEOTitleDescription = async (req, res) => {
  try {
      const {companyName, description, fewKeywords, tone, language, outputCount} = req.body;

      if (!companyName||!language||!tone || !outputCount||!description||!fewKeywords) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await SEOTitleDescription({companyName, description, fewKeywords, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating SEO Title Description' });
  }
};


exports.GeneratePromptGenerator = async (req, res) => {
  try {
      const {context, purpose, tone, creativityLevel, language, outputCount} = req.body;

      if (!context||!language||!tone || !outputCount||!purpose||!creativityLevel) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await PromptGenerator({context, purpose, tone, creativityLevel, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Prompt Generator' });
  }
};


exports.GenerateReviewReply = async (req, res) => {
  try {
      const { review, tone, language, outputCount} = req.body;

      if (!review||!language||!tone || !outputCount) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await ReviewReply({review, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Review Reply' });
  }
};


exports.GenerateVideoScript = async (req, res) => {
  try {
      const { topic, objective, tone, language, outputCount} = req.body;

      if (!topic||!language||!tone || !outputCount||!objective) {
          return res.status(400).json({ error: 'Please provide all required fields' });
      }

      const posts = await VideoScript({topic, objective, tone, language, outputCount});

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Review Reply' });
  }
};

// ***************Generate image from prompt***************

const { generateImagePrompt, generateImageFromSelectedPrompt } = require('../utils.js/GenerateImgFromPrompt');

// Controller for generating image prompts
exports.generatePrompts = async (req, res) => {
    const { mainObject, style, feeling, colors, background, language, outputCount } = req.body;
    try {
        const prompts = await generateImagePrompt(mainObject, style, feeling, colors, background, language, outputCount);
        if (!prompts || prompts.length === 0) {
            return res.status(400).json({ message: 'No prompts generated' });
        }
        res.status(200).json({ prompts });
    } catch (error) {
        console.error('Error generating prompts:', error);
        res.status(500).json({ message: 'Failed to generate image prompts' });
    }
};

// Controller for generating an image from a selected prompt.
exports.generateImageFromPrompt = async (req, res) => {
    const { prompt} = req.body;
    try {
        const imageData = await generateImageFromSelectedPrompt(prompt);
        if (!imageData || imageData.length === 0) {
            return res.status(400).json({ message: 'No image generated' });
        }
        res.status(200).json({ images: imageData });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Failed to generate image from prompt'});
    }
};

// ******************Generate image from prompt Ends here******************************



// *****************************Video prompt generator ***********************

const {generateVideoPromptContent}=require("../utils.js/videoPromptGenerator")

exports.GenerateVideoPromptContent = async (req, res) => {
    try {
        const { mainObject, style, mood, cameraAngles, sceneType, language, duration, outputCount } = req.body;

        if (!mainObject || !style || !mood || !cameraAngles || !sceneType || !language || !duration || !outputCount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const prompts = await generateVideoPromptContent(mainObject, style, mood, cameraAngles, sceneType, language, duration, outputCount);

        res.status(200).json(prompts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating prompts' });
    }

  };

  // *****************************Video prompt generator Ends here ***********************




  // ------------------------------------Visiting Card-------------------------------------
const { StandardFonts } = require('pdf-lib');

exports.generateVisiting=async (req,res)=>{
  try {
    const {
      name,
      position,
      phone,
      email,
      address,
      company,
      backgroundColor,
      nameColor,
      lineColor,
      positionColor,
      textColor,
      includeCompanyOnBack,
      includeLogoOnFront
    } = req.body;
  
    // Check for missing fields
    if (!name || !position || !phone || !email ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Create a new PDF Document for the front
    const frontPdfDoc = await PDFDocument.create();
  
    // Add a page for the front
    const frontPage = frontPdfDoc.addPage([400, 200]);
  
    // Check if a background image was uploaded and embed it, otherwise use a background color
    const backgroundFile = req.files?.background ? req.files.background[0].path : null;
    let backgroundImage;
  
    if (backgroundFile) {
      try {
        const backgroundBytes = fs.readFileSync(backgroundFile);
  
        // Detect MIME type using multer's provided file metadata instead of just the file extension
        const backgroundMimeType = req.files.background[0].mimetype;
  
        // Embed background image based on MIME type
        if (backgroundMimeType === 'image/jpeg' || backgroundMimeType === 'image/jpg') {
          backgroundImage = await frontPdfDoc.embedJpg(backgroundBytes);
        } else if (backgroundMimeType === 'image/png') {
          backgroundImage = await frontPdfDoc.embedPng(backgroundBytes);
        } else {
          return res.status(400).json({ error: 'Unsupported background image format. Only JPG and PNG are allowed.' });
        }
  
        // Add the background image to the front page
        frontPage.drawImage(backgroundImage, {
          x: 0,
          y: 0,
          width: 400,
          height: 200,
        });
      } catch (err) {
        return res.status(500).json({ error: 'Error embedding the background image' });
      }
    } else {
      // If no background image is uploaded, use the background color
      const bgColor = rgb(...hexToRgb(backgroundColor || '#FFFFFF'));
  
      // Front page background color
      frontPage.drawRectangle({
        x: 0,
        y: 0,
        width: 400,
        height: 200,
        color: bgColor,
      });
    }
  
    // Set up fonts for the front
    const frontFont = await frontPdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFrontFont = await frontPdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    // Check if logo file was uploaded and embed the image
    let logoImage;
  if (req.files?.logo) {
    try {
      const logoImageBytes = fs.readFileSync(req.files.logo[0].path);
  
      // Embed logo into the front PDF
      if (req.files.logo[0].mimetype === 'image/jpeg' || req.files.logo[0].mimetype === 'image/jpg') {
        logoImage = await frontPdfDoc.embedJpg(logoImageBytes);
      } else if (req.files.logo[0].mimetype === 'image/png') {
        logoImage = await frontPdfDoc.embedPng(logoImageBytes);
      } else {
        return res.status(400).json({ error: 'Unsupported logo image format. Only JPG and PNG are allowed.' });
      }
  
      // Draw the logo image on the front page at the calculated position
      if (includeLogoOnFront === 'true'){
      frontPage.drawImage(logoImage, {
        x: 330,
        y: 130,
        width: 50,
        height: 50,
      });
    }
  
    } catch (err) {
      console.error('Error while embedding the logo image:', err); // Log the error for better debugging
      return res.status(500).json({ error: 'Error embedding the logo image' });
    }
  }
  
  
    // Add name and position to the front page
    frontPage.drawText(name, {
      x: 20,
      y: 150,
      size: 20,
      font: boldFrontFont,
      color: rgb(...hexToRgb(nameColor || '#000000')),
    });
  
    frontPage.drawText(position, {
      x: 20,
      y: 130,
      size: 12,
      font: frontFont,
      color: rgb(...hexToRgb(positionColor || '#a2a2a3')),
    });
  
    // Draw a separating line on the front page
    frontPage.drawLine({
      start: { x: 20, y: 120 },
      end: { x: 150, y: 120 },
      thickness: 1,
      color: rgb(...hexToRgb(lineColor || '#FFFFFF')),
    });
  
    // Add contact details to the front page
    frontPage.drawText(`Phone: ${phone}`, {
      x: 20,
      y: 70,
      size: 12,
      font: frontFont,
      color: rgb(...hexToRgb(textColor || '#000000')),
    });
  
    frontPage.drawText(`Email: ${email}`, {
      x: 20,
      y: 50,
      size: 12,
      font: frontFont,
      color: rgb(...hexToRgb(textColor || '#000000')),
    });
  
    frontPage.drawText(`Address: ${address}`, {
      x: 20,
      y: 30,
      size: 12,
      font: frontFont,
      color: rgb(...hexToRgb(textColor || '#000000')),
    });
  
    // Create a back page in the same PDF
    const backPage = frontPdfDoc.addPage([400, 200]);
  
    // Apply the same background image to the back side
    if (backgroundImage) {
      backPage.drawImage(backgroundImage, {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
      });
    } else {
      // Use background color if no image was provided
      const backBgColor = rgb(...hexToRgb(backgroundColor || '#FFFFFF'));
      backPage.drawRectangle({
        x: 0,
        y: 0,
        width: 400,
        height: 200,
        color: backBgColor,
      });
    }
  
    // Embed the logo on the back page (centered horizontally and vertically)
    if (logoImage) {
      backPage.drawImage(logoImage, {
        x: (400 - 100) / 2, // Horizontally center the logo (logo width: 100)
        y: (200 - 100) / 2 , // Vertically center the logo (logo height: 100)
        width: 100,
        height: 100,
      });
    }
  
    // Draw the company name centered below the logo on the back page
    if (includeCompanyOnBack === 'true') {
    backPage.drawText(company, {
      x: (400 - boldFrontFont.widthOfTextAtSize(company, 20)) / 2, // Horizontally center the company text
      y: (200 - 100) / 2 - 20, // Place below the logo
      size: 20,
      font: boldFrontFont,
      color: rgb(...hexToRgb(textColor || '#000000')) // Default to black text
    });
  }
  
    // Serialize the PDFs for front and back
    const pdfBytes = await frontPdfDoc.save();
  
    // Set headers to download the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=visiting_card.pdf');
    res.send(Buffer.from(pdfBytes));
  
    // Clean up temporary files
    if (req.files?.logo) {
      fs.unlink(req.files.logo[0].path, (err) => {
        if (err) console.error('Error deleting the logo file:', err);
      });
    }
    if (backgroundFile) {
      fs.unlink(backgroundFile, (err) => {
        if (err) console.error('Error deleting the background file:', err);
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error generating visiting cards" });
  }
}


function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255]; // Normalize to 0-1 range
}

// ------------------------------------Visiting Card End's Here-------------------------------------




// --------------------------------------- LETTER HEAD GENERATOR---------------------------------------
exports.generateLetterHead=async (req,res)=>{
  try {
    const { headerText, address, phone, email, website, HeaderColor, currentDate, FooterColor, FooterLineColor, watermarkType, watermarkText } = req.body;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Load standard fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Set font sizes
    const headerFontSize = 22;
    const footerFontSize = 12;

    // Function to convert hex color to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r / 255, g / 255, b / 255]; // Normalize to 0-1 range
    }

    // Add background image if provided
    if (req.files && req.files.background) {
        const backgroundImageBytes = fs.readFileSync(req.files.background[0].path);
        let backgroundImage;

        if (req.files.background[0].mimetype === 'image/jpeg' || req.files.background[0].mimetype === 'image/jpg') {
            backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
        } else if (req.files.background[0].mimetype === 'image/png') {
            backgroundImage = await pdfDoc.embedPng(backgroundImageBytes);
        } else {
            return res.status(400).json({ error: 'Unsupported background image format. Only JPG and PNG are allowed.' });
        }

        // Draw the background image to fill the entire page
        page.drawImage(backgroundImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
            opacity: 0.5 // Optional: Adjust opacity if needed
        });
    }

    // Add header text
    page.drawText(headerText, {
        x: 120,
        y: height - 80,
        size: headerFontSize,
        font: helveticaFont,
        color: rgb(...hexToRgb(HeaderColor || '#FFFFFF')) // Custom color for header
    });

    // Add date text just below the header
    page.drawText(`Date: ${currentDate}`, {
        x: 450,
        y: height - 150, // Adjust the Y position as needed
        size: 16,
        font: timesRomanFont,
        color: rgb(0.2, 0.2, 0.2), // Dark grey color for date
    });

    // Add a logo if it exists
    if (req.files && req.files.logo) {
        const logoImageBytes = fs.readFileSync(req.files.logo[0].path);
        let logoImage;

        if (req.files.logo[0].mimetype === 'image/jpeg' || req.files.logo[0].mimetype === 'image/jpg') {
            logoImage = await pdfDoc.embedJpg(logoImageBytes);
        } else if (req.files.logo[0].mimetype === 'image/png') {
            logoImage = await pdfDoc.embedPng(logoImageBytes);
        } else {
            return res.status(400).json({ error: 'Unsupported logo image format. Only JPG and PNG are allowed.' });
        }

        // Add the logo to the header (top-left corner)
        page.drawImage(logoImage, {
            x: 50,
            y: height - 90,
            width: 40,
            height: 40 // Adjust the size as needed
        });
    }

    // Add a watermark (logo or text) to the center of the page
    if (watermarkType === 'logo' && req.files && req.files.logo) {
        const logoImageBytes = fs.readFileSync(req.files.logo[0].path);
        let logoImage;

        if (req.files.logo[0].mimetype === 'image/jpeg' || req.files.logo[0].mimetype === 'image/jpg') {
            logoImage = await pdfDoc.embedJpg(logoImageBytes);
        } else if (req.files.logo[0].mimetype === 'image/png') {
            logoImage = await pdfDoc.embedPng(logoImageBytes);
        }

        // Add the logo as a watermark (center of the page)
        const logoWidth = 300;  // Adjust based on your logo dimensions
        const logoHeight = 300; // Adjust based on your logo dimensions
        const centerX = (width - logoWidth) / 2;
        const centerY = (height - logoHeight) / 2;

        // Draw the logo as a watermark with lower opacity
        page.drawImage(logoImage, {
            x: centerX,
            y: centerY,
            width: logoWidth,
            height: logoHeight,
            opacity: 0.15 // Set the opacity (0.0 = fully transparent, 1.0 = fully opaque)
        });
    } else if (watermarkType === 'text' && watermarkText) {
        // Add text as a watermark in the center of the page
        const textFontSize = 90; // Adjust as needed
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, textFontSize);
        const textX = (width - textWidth+30);
        const textY = height / 4;
    
        // Set rotation angle in degrees
        const rotationAngle = 45; // 45 degrees
    
        page.drawText(watermarkText, {
            x: textX,
            y: textY,
            size: textFontSize,
            font: helveticaFont,
            color: rgb(0.5, 0.5, 0.5), // Grey color for watermark text
            opacity: 0.15, // Set lower opacity for the watermark
            rotate: degrees(rotationAngle), // Use degrees function to set rotation
        });
    }
    

    // Draw a horizontal line before the footer
    page.drawLine({
        start: { x: 50, y: 120 },
        end: { x: width - 50, y: 120 },
        thickness: 1,
        color: rgb(...hexToRgb(FooterLineColor || '#FFFFFF')),
    });

    // Add footer fields (address, phone, email, website) with grey text
    const footerTextY = 100;

    if (address) {
        page.drawText(`Address: ${address}`, {
            x: 55,
            y: footerTextY,
            size: footerFontSize,
            font: helveticaFont,
            color: rgb(...hexToRgb(FooterColor || '#FFFFFF')),
        });
    }

    if (phone) {
        page.drawText(`Phone: ${phone}`, {
            x: 55,
            y: footerTextY - 16,
            size: footerFontSize,
            font: timesRomanFont,
            color: rgb(...hexToRgb(FooterColor || '#FFFFFF')),
        });
    }

    if (email) {
        page.drawText(`Email: ${email}`, {
            x: 55,
            y: footerTextY - 34,
            size: footerFontSize,
            font: helveticaFont,
            color: rgb(...hexToRgb(FooterColor || '#FFFFFF')),
        });
    }

    if (website) {
        page.drawText(`Website: ${website}`, {
            x: 55,
            y: footerTextY - 50,
            size: footerFontSize,
            font: timesRomanFont,
            color: rgb(...hexToRgb(FooterColor || '#FFFFFF')),
        });
    }

    // Save the PDF as bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers to serve a PDF
    res.setHeader('Content-Disposition', 'attachment; filename=Generatedletterhead.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF as a buffer
    res.send(Buffer.from(pdfBytes));

    // After the PDF is sent, delete the uploaded files
    if (req.files && req.files.logo) {
        fs.unlinkSync(req.files.logo[0].path);
    }

    if (req.files && req.files.background) {
        fs.unlinkSync(req.files.background[0].path);
    }

} catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'An error occurred while generating the letterhead' });
}
}


// --------------------------------------- LETTER HEAD GENERATOR ENDS HERE---------------------------------------



// ----------------------------------------- FREE EMAIL STYLE GENERATOR -----------------------------------------
const generateFreestyleEmailUtil=require("../utils.js/FreeStyleEmail")

exports.generateFreeEmail = async (req, res) => {
  const { to, subject, content, tone, writingStyle, recipient, language, outputCount } = req.body;

    // Validation to ensure required fields are provided
    if (!to || !subject || !content || !tone || !writingStyle || !language || !outputCount) {
        return res.status(400).json({
            error: 'Missing required fields. Ensure to include to, subject, content, tone, writingStyle, language, and outputCount.'
        });
    }

    try {
        // Call the email generation utility
        const emailResponses = await generateFreestyleEmailUtil(to, subject, content, tone, writingStyle, recipient, language, outputCount);
        
        // Respond with generated emails
        return res.status(200).json({
            success: true,
            emails: emailResponses
        });
    } catch (error) {
        console.error('Error generating freestyle emails:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate freestyle emails.'
        });
    }
};

// --------------------------------------------FREE STYLE EMAIL ENDS HERE----------------------------------




// ----------------------------------------------EMAIL REPLIE GENERATOR---------------------------------

const {generateReplyEmailUtil}=require("../utils.js/EmailReplie")

exports.generateemailreplie=async(req,res)=>{
  const { to, receivedEmail, tone, language, outputCount,replyIntent } = req.body;

    // Validation to ensure required fields are provided
    if (!to || !receivedEmail || !tone || !language || !outputCount ||!replyIntent) {
        return res.status(400).json({
            error: 'Missing required fields. Ensure to include to, receivedEmail, tone, language, and outputCount.'
        });
    }

    try {
        // Call the email reply generation utility
        const emailResponses = await generateReplyEmailUtil(to, receivedEmail, tone, language, outputCount,replyIntent);
        
        // Respond with generated email replies
        return res.status(200).json({
            success: true,
            emails: emailResponses
        });
    } catch (error) {
        console.error('Error generating reply emails:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate reply emails.'
        });
    }
}

// --------------------------------------------EMAIL REPLIE GENERATOR ENDS HERE---------------------------------




// -------------------------------------------------AUDIO REPHRASE-----------------------------------------------
const {convertToAudio, transcribeToaudio, rephrasetext,textToVoice,summarizeTheText}=require("../utils.js/AudioRepharse")

exports.audioRepharse=async(req,res)=>{
  const audioPath = req.file.path; // Uploaded file path
  const tone = req.body.tone; // Default tone
  const targetLanguage = req.body.targetLanguage;
  try {
    // Step 1: Convert audio to MP3 if needed (optional if input isn't MP3)
    const mp3Path = `uploads/${Date.now()}_converted.mp3`;
    await convertToAudio(audioPath, mp3Path);

    // Step 2: Transcribe the audio to text
    const transcribedText = await transcribeToaudio(mp3Path);
    // console.log('Transcribed Text:', transcribedText);

    // Step 3: Rephrase the transcribed text
    const rephrasedText = await rephrasetext(transcribedText);
    // console.log('Rephrased Text:', rephrasedText);

    const translatedText = await translateText(rephrasedText, targetLanguage)

    // Step 4: Convert the rephrased text back to audio
    const audioBuffer = await textToVoice(translatedText, tone);
    console.log('Generated audio buffer size:', audioBuffer.length);

    // Cleanup the uploaded and intermediate files
    fs.unlinkSync(audioPath); // Delete uploaded file
    fs.unlinkSync(mp3Path); // Delete converted MP3 file

    // Send the generated audio file in the response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="rephrased_audio.mp3"',
    });
    res.send(audioBuffer); // Send the audio buffer as the response
  } catch (error) {
    console.error('Error processing audio:', error.message);

    // Cleanup in case of error
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);

    res.status(500).json({ error: error.message });
  }
}

// -------------------------------------------------AUDIO REPHRASE ENDS HERE-------------------------------



// -----------------------------------------------SVG to JPG------------------------------------------

const svg2img = require('svg2img');
// const fs = require('fs');

// Helper function to clean SVG data
const cleanSvg = (svg) => {
  return svg
    .replace(/<\?xml[^>]*>/g, '') // Remove XML declaration
    .replace(/<!DOCTYPE[^>]*>/g, '') // Remove DOCTYPE
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .trim();
};

exports.convertSvgToJpeg = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level
  });

  // Set headers to download the ZIP file
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');

  archive.pipe(res); // Pipe the archive data to the response

  try {
    await Promise.all(req.files.map(async (file) => {
      const svgFilePath = file.path; // Get the path of the uploaded SVG file
      const sourceBuffer = fs.readFileSync(svgFilePath); // Read the SVG file

      // Clean the SVG data (optional, but can help with issues in the conversion)
      const cleanedSvg = cleanSvg(sourceBuffer.toString('utf-8'));

      // Convert SVG to JPG
      const jpgBuffer = await new Promise((resolve, reject) => {
        svg2img(cleanedSvg, { format: 'jpeg', quality: 90 }, (error, buffer) => {
          if (error) {
            return reject(error);
          }
          resolve(buffer);
        });
      });

      // Add the JPG file to the zip archive with the original filename as JPG
      const jpgFilename = path.parse(file.originalname).name + '.jpg';
      archive.append(jpgBuffer, { name: jpgFilename });

      // Delete the SVG file after processing
      fs.unlink(svgFilePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }));

    // Finalize the archive (finish adding files to the ZIP)
    await archive.finalize();

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).send('Error converting images: ' + error.message);
  }
};
// -----------------------------------------------SVG to JPG ENDS HERE------------------------------------------




// --------------------------------------------------SVG TO PNG -----------------------------------------

const svg2png = require('svg2png');

exports.svgtopngconverter = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level
  });

  // Set headers to download the ZIP file
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');

  archive.pipe(res); // Pipe the archive data to the response

  try {
    await Promise.all(req.files.map(async (file) => {
      const svgFilePath = file.path; // Get the path of the uploaded SVG file
      const sourceBuffer = fs.readFileSync(svgFilePath); // Read the SVG file

      // Optionally set width and height for each file
      const options = {
        width: 300,  // Specify width (can be omitted to use SVG dimensions)
        height: 400, // Specify height (can be omitted to use SVG dimensions)
      };

      // Convert SVG to PNG
      const pngBuffer = await svg2png(sourceBuffer, options);

      // Add the PNG file to the zip archive with the original filename as PNG
      const pngFilename = path.parse(file.originalname).name + '.png';
      archive.append(pngBuffer, { name: pngFilename });

      // Delete the SVG file after processing
      fs.unlink(svgFilePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }));

    // Finalize the archive (finish adding files to the ZIP)
    await archive.finalize();

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).send('Error converting images: ' + error.message);
  }
};


// ---------------------Video Summary Generator--------------------

exports.videoRepharse = async (req, res) => {
  const videoPath = req.file.path; // Uploaded video file path
  const targetLanguage = req.body.targetLanguage || 'en';
  const audioOutputPath = `uploads/${Date.now()}_converted.mp3`; // Path to store the extracted audio

  try {
    // Step 1: Convert video to audio
    await extractAndConvertToMP3(videoPath, audioOutputPath);

    // Step 2: Transcribe the audio to text
    const transcribedText = await transcribeToaudio(audioOutputPath);

    // Step 3: Rephrase the transcribed text
    const rephrasedText = await summarizeTheText(transcribedText);

    // Step 4: Optionally translate the rephrased text
    const translatedText = await translateText(rephrasedText, targetLanguage);

    // Cleanup the uploaded and intermediate files
    fs.unlinkSync(videoPath); // Delete uploaded video
    fs.unlinkSync(audioOutputPath); // Delete converted MP3 file

    // Send the summarized text as the response
    res.set({
      'Content-Type': 'application/json', 
    });
    res.json({ summarizedText: translatedText });
  } catch (error) {
    console.error('Error processing video:', error.message);

    // Cleanup in case of error
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(audioOutputPath)) fs.unlinkSync(audioOutputPath);

    res.status(500).json({ error: error.message });
  }
};



// ------------------Speech Converter--------------

exports.speechConverter = async (req, res) => {
  const { text, targetLanguage, tone } = req.body;

  // Basic input validation
  if (!text || !targetLanguage || !tone) {
    return res.status(400).json({ error: 'Please provide text, targetLanguage, and tone' });
  }

  try {
    // Translate the text
    const translatedText = await translate(text, targetLanguage);
    
    // Convert translated text to audio
    const audioFile = await textToSpeech(translatedText, tone);

    // Check if audio file is properly generated
    if (!fs.existsSync(audioFile)) {
      throw new Error('Audio file generation failed.');
    }

    // Send the audio file as response
    res.sendFile(audioFile, { root: process.cwd() }, (err) => {
      if (err) {
        console.error('Error sending audio file:', err);
        return res.status(500).json({ error: 'Failed to send audio file' });
      }
      // Optional: Cleanup the file after sending if it's temporary
      fs.unlink(audioFile, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting audio file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Error in speechConverter:', error);
    res.status(500).json({ error: error.message || 'Error translating text or generating audio.' });
  }
};


exports.addBackground=async(req,res)=>{
  const prompt = req.body.prompt;
  const numberOfImages = req.body.n || 1; // Default to 1 if not provided

  // Ensure the required image and prompt fields are present
  if (!req.files.image) {
    return res.status(400).send('No image file uploaded or file is not a valid PNG image.');
  }

  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }

  try {
    // Create form data for sending to OpenAI
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.files.image[0].path)); // Upload the main image
    formData.append('prompt', prompt); // Add the user prompt
    formData.append('size', '1024x1024'); // Optional size parameter
    formData.append('n', numberOfImages); // Add number of images to generate


    // Send request to OpenAI
    const response = await axios.post('https://api.openai.com/v1/images/edits', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // API Key from env
        ...formData.getHeaders(),
      }
    });

    // Clean up the uploaded image(s) after the request (optional)
    fs.unlinkSync(req.files.image[0].path);

    // Extract image URLs from the response
    const imageUrls = response.data.data.map(img => img.url);

    // Send the image URLs as JSON response
    res.json({ imageUrls });
  } catch (error) {
    console.error('Error editing image:', error.response ? error.response.data : error.message);
    res.status(500).send('Something went wrong while editing the image.');
  }
}

// -------------------JPG/PNG to Webp Converter-----------------------

exports.convertToWebp = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Create a zip archive
  const archive = archiver('zip', {
    zlib: { level: 9 } // Set the compression level
  });

  // Set headers for downloading the ZIP file
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=converted_images.zip');

  archive.pipe(res); // Pipe the archive data to the response

  try {
    await Promise.all(req.files.map(async (file) => {
      const imageFilePath = file.path; // Get the path of the uploaded image file
      const imageBuffer = fs.readFileSync(imageFilePath); // Read the image file

      // Convert image to WebP
      const webpBuffer = await sharp(imageBuffer)
        .webp({ quality: 80 }) // Set WebP quality (0-100)
        .toBuffer();

      // Add the WebP file to the zip archive with the original filename as WebP
      const webpFilename = path.parse(file.originalname).name + '.webp';
      archive.append(webpBuffer, { name: webpFilename });

      // Delete the original image file after processing
      fs.unlink(imageFilePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }));

    // Finalize the archive (finish adding files to the ZIP)
    await archive.finalize();

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).send('Error converting images: ' + error.message);
  }
};


// ---------------Webp to JPG/PNG converter------------------

const webp = require('webp-converter');

exports.webpToImages=async(req,res)=>{
  const { conversionType } = req.body;

    // Validate conversion type
    if (!['jpg', 'png'].includes(conversionType)) {
        return res.status(400).send('Invalid conversion type. Please choose either jpg or png.');
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const convertedFiles = [];
    const conversionPromises = req.files.map((file) => {
        const inputPath = file.path; // Path to the uploaded WebP file
        const outputPath = path.join('uploads', `${file.filename}.${conversionType}`); // Output path for the converted file

        // Convert the WebP image to the desired format
        return webp.dwebp(inputPath, outputPath, "-o", logging = "-v").then(() => {
            convertedFiles.push(outputPath);
        });
    });

     // Wait for all images to be converted
     Promise.all(conversionPromises).then(() => {
      // Create a zip file to store the converted images
      const zipPath = path.join(__dirname, 'uploads', 'converted_images.zip');
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
          // Send the zip file to the client
          res.download(zipPath, (err) => {
              // Clean up: delete the zip and all converted images after sending the response
              fs.unlinkSync(zipPath);
              convertedFiles.forEach((file) => fs.unlinkSync(file));
              req.files.forEach((file) => fs.unlinkSync(file.path)); // Delete uploaded WebP files
              if (err) {
                  console.error('Error sending file:', err);
              }
          });
      });

      archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Append converted files to the zip
    convertedFiles.forEach((file) => {
        const fileName = path.basename(file); // Get the filename
        archive.file(file, { name: fileName });
    });

    // Finalize the zip archive
    archive.finalize();
}).catch((err) => {
    console.error('Conversion failed:', err);
    res.status(500).send('Conversion failed.');
});

}


// ----------------AI Based SEO Optimizer---------------

exports.optimizeSEO = async (req, res) => {
  try {
      const { content, language, outputCount } = req.body;

      if (!content) {
          return res.status(400).json({ error: 'Please provide content for SEO optimization' });
      }

      const seoSuggestions = await generateSEOSuggestions(content, language, outputCount);

      res.status(200).json(seoSuggestions);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating SEO suggestions' });
  }
};


// --------------------AI Based SEO Content Improver--------------

exports.improveSEOContent = async (req, res) => {
    try {
        const { content, language, outputCount } = req.body;

        // Validate input
        if (!content) {
            return res.status(400).json({ error: 'Please provide the content for SEO improvement' });
        }

        const seoImprovements = await generateSEOImprovements(content, language, outputCount);

        res.status(200).json(seoImprovements);
    } catch (error) {
        console.error('Error improving SEO content:', error);
        res.status(500).json({ error: 'Error improving SEO content' });
    }
};


// -----------------AI SEO Audit and Recommendation------------

exports.auditSEO = async (req, res) => {
    try {
        const { content, language, outputCount } = req.body;

        // Validate input
        if (!content) {
            return res.status(400).json({ error: 'Please provide the content for SEO audit' });
        }

        const seoAudit = await generateSEOAudit(content, language, outputCount);

        res.status(200).json(seoAudit);
    } catch (error) {
        console.error('Error auditing SEO:', error);
        res.status(500).json({ error: 'Error performing SEO audit' });
    }
};


// ---------------Google Ad Headline and Description Generator--------------

const {generateGoogleAdContent} = require("../utils.js/generativeTools")

exports.generateGoogleAd = async (req, res) => {
  try {
      const { productOrService, whatsAdFor, targetAudience, tone, language, outputCount } = req.body;

      // Validate input fields
      if (!productOrService) {
          return res.status(400).json({ error: 'Please provide a product or service for the ad.' });
      }

      // Call the utility function to generate Google Ad content
      const googleAdContent = await generateGoogleAdContent(productOrService, whatsAdFor, targetAudience, tone, language, outputCount);

      res.status(200).json(googleAdContent);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error generating Google Ad headline and description' });
  }
};

// ------------------Split PDF-------------------------
async function splitPDF(inputPath) {
  const pdfBuffer = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const totalPages = pdfDoc.getPageCount();
  const outputPaths = [];

  for (let i = 0; i < totalPages; i++) {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);

      const outputPath = `output/page-${i + 1}.pdf`;
      outputPaths.push(outputPath);
      const pdfBytes = await newPdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
  }

  return outputPaths;
}


exports.splitPdf=async(req,res)=>{
  try {
    const filePath = req.file.path;
    const outputFiles = await splitPDF(filePath);

    // Create a ZIP archive with Archiver
    const zipFileName = `split-pdfs.zip`;
    const zipFilePath = path.join(__dirname, zipFileName);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        // Send the zip file as response
        res.download(zipFilePath, (err) => {
            // After sending the response, delete the files and zip
            if (err) {
                console.error('Error sending file:', err);
            }

            // Delete the temporary files
            outputFiles.forEach((file) => fs.unlinkSync(file));
            fs.unlinkSync(filePath);
            fs.unlinkSync(zipFilePath);
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Append each PDF file to the zip
    outputFiles.forEach((file) => {
        archive.file(file, { name: path.basename(file) });
    });

    // Finalize the archive
    archive.finalize();
} catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing the PDF.');
}
}


// -----------------------Watermark PDF-----------------------

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

exports.watermarkPdf = async (req, res) => {
  try {
    // Retrieve parameters from the request body
    const watermarkText = req.body.watermark;
    const hexColor = req.body.color || '#bfbfbf'; // Default to light gray in hex
    const color = hexToRgb(hexColor); // Convert hex to RGB
    const fontSize = parseFloat(req.body.fontSize) || 50; // Default to 50
    const rotation = parseFloat(req.body.rotation) === 45 ? degrees(45) : degrees(0); // Default to 0 degrees

    // Load the uploaded PDF file
    const filePath =req.files['pdf'][0].path;
    const existingPdfBytes = fs.readFileSync(filePath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Get the total number of pages
    const pages = pdfDoc.getPages();

    // Check if an image is provided for watermark
    if (req.files['image']) {
      const imagePath = req.files['image'][0].path;
      const imageBytes = fs.readFileSync(imagePath);
      const image = await pdfDoc.embedPng(imageBytes); // Assuming PNG image, you can use `embedJpg` for JPGs
      const { width: imageWidth, height: imageHeight } = image.scale(0.5); // Scale image

      // Define the fixed height for the watermark image
const fixedHeight = 250; // Set your desired fixed height for the image

// Calculate the width based on the image's aspect ratio
const aspectRatio = imageWidth / imageHeight;
const scaledWidth = fixedHeight * aspectRatio;

// Add the image watermark to each page, centered with fixed height and proportional width
pages.forEach(page => {
  const { width, height } = page.getSize();

  page.drawImage(image, {
    x: width / 2 - scaledWidth / 2, // Center horizontally
    y: height / 2 - fixedHeight / 2, // Center vertically
    width: scaledWidth, // Adjusted width to maintain aspect ratio
    height: fixedHeight, // Fixed height
    opacity: 0.3, // Set opacity
    rotate: rotation, // Custom rotation
  });
});


      // Clean up the uploaded image file
      fs.unlinkSync(imagePath);
    } else if (watermarkText) {
      // If no image, apply text watermark
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add the text watermark to each page
      pages.forEach(page => {
        const { width, height } = page.getSize();

        page.drawText(watermarkText, {
          x: width / 2 - 100, // Center horizontally
          y: height / 2, // Center vertically
          size: fontSize,
          font: helveticaFont,
          color: rgb(color.r, color.g, color.b), // Use converted RGB color
          opacity: 0.3,
          rotate: rotation, // Custom rotation
        });
      });
    } else {
      return res.status(400).send('No watermark text or image provided');
    }

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Set headers to indicate a downloadable file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');

    // Send the modified PDF as response
    res.send(Buffer.from(pdfBytes));

    // Clean up the uploaded PDF file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error adding watermark:', error);
    res.status(500).send('Failed to add watermark');
  }
}

// ------------------SEO Competitor Analysis--------------------

exports.seoCompetitorAnalysis = async (req, res) => {
  try {
      const { competitorUrls, language, outputCount } = req.body;

      // Validate input
      if (!competitorUrls || competitorUrls.length === 0) {
          return res.status(400).json({ error: 'Please provide competitor URLs for analysis' });
      }

      const analysisResults = await generateCompetitorAnalysis(competitorUrls, language, outputCount);

      res.status(200).json(analysisResults);
  } catch (error) {
      console.error('Error performing competitor analysis:', error);
      res.status(500).json({ error: 'Error performing competitor analysis' });
  }
};

const { promisify } = require('util');
const convert = require('heic-convert');
exports.ConvertHeic=async(req,res)=>{
  try {
    const conversionType = req.body.conversionType || 'JPEG'; // Default to JPEG if not provided
    const format = conversionType.toUpperCase();

    if (format !== 'JPEG' && format !== 'PNG') {
      return res.status(400).send('Invalid conversion type. Please use "JPEG" or "PNG".');
    }

    const outputFiles = [];

    // Process each uploaded file
    for (const file of req.files) {
      // Read the uploaded HEIC file
      const inputBuffer = await promisify(fs.readFile)(file.path);

      // Convert the HEIC file to the desired format (JPEG or PNG)
      const outputBuffer = await convert({
        buffer: inputBuffer,  // HEIC file buffer
        format: format,       // Output format (JPEG or PNG)
        quality: format === 'JPEG' ? 1 : undefined  // JPEG compression quality (for JPEG only)
      });

      const outputExtension = format === 'JPEG' ? 'jpg' : 'png';
      const outputFilePath = `./uploads/result-${Date.now()}-${file.originalname}.${outputExtension}`;

      // Write the converted file to the uploads directory
      await promisify(fs.writeFile)(outputFilePath, outputBuffer);

      // Add the converted file path to the list of output files
      outputFiles.push({
        path: outputFilePath,
        name: path.basename(outputFilePath)
      });

      // Optionally delete the original HEIC file
      fs.unlinkSync(file.path);
    }

    // If there's only one file, send it directly in the response
    if (outputFiles.length === 1) {
      const singleFilePath = outputFiles[0].path;
      res.download(singleFilePath, outputFiles[0].name, () => {
        // Delete the single file after sending
        fs.unlinkSync(singleFilePath);
      });
    } else {
      // If there are multiple files, zip them and send the zip file
      const zipFilePath = `./uploads/converted-images-${Date.now()}.zip`;
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Handle archive finalization and errors
      archive.on('error', function(err) {
        throw err;
      });

      // Pipe the zip file stream to the output file
      archive.pipe(output);

      // Append each converted file to the zip
      outputFiles.forEach((file) => {
        archive.file(file.path, { name: file.name });
      });

      // Finalize the archive (this will create the zip file)
      await archive.finalize();

      // When the zip is done, send it to the client and delete the files
      output.on('close', () => {
        res.download(zipFilePath, 'converted-images.zip', () => {
          // Clean up: delete the converted files and the zip file
          outputFiles.forEach((file) => fs.unlinkSync(file.path));
          fs.unlinkSync(zipFilePath);
        });
      });
    }
  } catch (error) {
    console.error('Error converting files:', error);
    res.status(500).send('Error converting files');
  }
}
