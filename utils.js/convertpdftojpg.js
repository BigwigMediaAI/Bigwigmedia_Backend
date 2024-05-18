const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const pdf = require('pdf-poppler');

async function convertPdfToJpg(pdfPath, outputDir) {
    try {
      await fs.ensureDir(outputDir);
  
      const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null
      };
  
      // Convert PDF to PNG using pdf-poppler
      await pdf.convert(pdfPath, options);
  
      // Get the list of PNG files generated
      const files = await fs.readdir(outputDir);
      const pngFiles = files.filter(file => file.endsWith('.png'));
  
      const jpgFiles = [];
  
      // Convert each PNG to JPG using sharp
      for (const pngFile of pngFiles) {
        const inputFilePath = path.join(outputDir, pngFile);
        const outputFilePath = path.join(outputDir, `${path.basename(pngFile, '.png')}.jpg`);
        
        const jpgBuffer = await sharp(inputFilePath)
          .jpeg({ quality: 80 })
          .toBuffer();
  
        await fs.writeFile(outputFilePath, jpgBuffer);
        await fs.remove(inputFilePath); // Remove the intermediate PNG file
  
      //   console.log(Converted ${pngFile} to JPG and saved to ${outputFilePath});
        jpgFiles.push(outputFilePath);
      }
  
    //   console.log('PDF successfully converted to JPG.');
      return jpgFiles;
    } catch (error) {
      console.error('Error converting PDF to JPG:', error);
      throw error;
    }
  }


  module.exports = convertPdfToJpg