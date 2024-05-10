const Tesseract = require('tesseract.js');


async function processImage(filePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        return text;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}


module.exports = processImage;
