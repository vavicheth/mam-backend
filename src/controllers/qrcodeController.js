import QRCode from 'qrcode';
import asyncHandler from 'express-async-handler';
import { createCanvas, loadImage } from 'canvas';

/**
 * Generate QR code image from text
 * @param {string} text - The text to encode in the QR code
 * @returns {Promise<string>} - Base64 encoded QR code image
 */
export const generateQRCode = asyncHandler(async (req, res) => {
  const { text } = req.body;
  // const { text } = "http://localhost:300";

  if (!text) {
    res.status(400);
    throw new Error('Text parameter is required');
  }

  try {
    // Generate QR code as data URL (base64 encoded image)
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300
    });

    res.status(200).json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        text: text
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
});

/**
 * Generate QR code image with title and description - supports both preview and download
 * @param {string} text - The text to encode in the QR code
 * @param {string} title - Title text to display at the top (optional)
 * @param {string} description - Description text to display at the bottom (optional)
 * @param {string} mode - 'preview' or 'download' (query parameter)
 * @returns {Promise<Buffer>} - QR code image buffer with title and description
 */
export const generateQRCodeImage = asyncHandler(async (req, res) => {
  const { text, title, description } = req.body;
  const { mode } = req.query; // Get mode from query parameter: ?mode=preview or ?mode=download

  if (!text) {
    res.status(400);
    throw new Error('Text parameter is required');
  }

  try {
    // QR code dimensions
    const qrSize = 300;
    const padding = 20;
    const titleHeight = title ? 60 : 0;
    const descriptionHeight = description ? 80 : 0;
    const qrColor = '#000060'; // Dark blue color for QR code

    // Calculate canvas dimensions
    const canvasWidth = qrSize + (padding * 2);
    const canvasHeight = qrSize + titleHeight + descriptionHeight + (padding * 2);

    // Generate QR code as data URL with custom colors
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: qrSize,
      color: {
        dark: qrColor,  // QR code color
        light: '#ffffff' // Background color
      }
    });

    // Create canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw title if provided
    if (title) {
      ctx.fillStyle = '#000060';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, canvasWidth / 2, padding + (titleHeight / 2));
    }

    // Load and draw QR code
    const qrImage = await loadImage(qrCodeDataURL);
    const qrYPosition = padding + titleHeight;
    ctx.drawImage(qrImage, padding, qrYPosition, qrSize, qrSize);

    // Draw description if provided
    if (description) {
      ctx.fillStyle = '#000060';
      ctx.font = '16px Siemreap';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Word wrap for description
      const maxWidth = canvasWidth - (padding * 2);
      const lineHeight = 22;
      const words = description.split(' ');
      let line = '';
      let y = qrYPosition + qrSize + padding + 10;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, canvasWidth / 2, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvasWidth / 2, y);
    }

    // Convert canvas to buffer
    const imageBuffer = canvas.toBuffer('image/png');

    res.setHeader('Content-Type', 'image/png');

    // Set Content-Disposition based on mode
    if (mode === 'download') {
      // Force download
      res.setHeader('Content-Disposition', `attachment; filename="qrcode-${Date.now()}.png"`);
    } else {
      // Preview inline (default)
      res.setHeader('Content-Disposition', 'inline');
    }

    res.status(200).send(imageBuffer);
  } catch (error) {
    res.status(500);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
});