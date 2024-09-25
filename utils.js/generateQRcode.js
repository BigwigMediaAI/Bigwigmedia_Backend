const QRCode = require('qrcode');
const Jimp = require('jimp');
const fs = require('fs');
const path = require("path");
// Function to generate QR code with logo
async function generateQRCodeWithLogo(text, filename, logoPath, color,textAboveQR, textBelowQR) {
    try {
        // Log color value
        console.log('Color:', color);

        // Generate QR code
        const qrCode = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H',width:300 });

        // Load QR code image
        const qrImage = await Jimp.read(Buffer.from(qrCode.replace(/^data:image\/png;base64,/, ''), 'base64'));

        if (logoPath) {
            // Load logo image
            let logo = await Jimp.read(logoPath);

            // Resize logo to a smaller size
            logo.resize(50, 50); // Adjust size as needed

            // Calculate position to place the logo at the center of the QR code
            const xPos = (qrImage.bitmap.width - logo.bitmap.width) / 2;
            const yPos = (qrImage.bitmap.height - logo.bitmap.height) / 2;

            // Overlay logo onto the QR code image
            qrImage.composite(logo, xPos, yPos);
        }

        // Apply color to the QR code image if color is provided
        if (color) {
            qrImage.scan(0, 0, qrImage.bitmap.width, qrImage.bitmap.height, function (x, y, idx) {
                const red = this.bitmap.data[idx];
                const green = this.bitmap.data[idx + 1];
                const blue = this.bitmap.data[idx + 2];
                const alpha = this.bitmap.data[idx + 3];

                if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
                    // Replace black pixels with the provided color
                    this.setPixelColor(Jimp.cssColorToHex(color), x, y);
                }
            });
        }

        // Add text above the QR code
        if (textAboveQR) {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            const textWidth = Jimp.measureText(font, textAboveQR);
            const textX = (qrImage.bitmap.width - textWidth) / 2;
            const textY = 5; // Adjust vertical position as needed
            qrImage.print(font, textX, textY, textAboveQR);
        }

        // Add text below the QR code
        if (textBelowQR) {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
            const textWidth = Jimp.measureText(font, textBelowQR);
            const textX = (qrImage.bitmap.width - textWidth)/2;
            const textY = qrImage.bitmap.height - 20; // Adjust vertical position as needed
            qrImage.print(font, textX, textY, textBelowQR);
        }

        // Save the modified QR code image
        await qrImage.writeAsync(filename);

        console.log('QR Code with logo and color generated successfully!');
    } catch (error) {
        console.error('Error generating QR code with logo and color:', error);
    }
}

module.exports=generateQRCodeWithLogo