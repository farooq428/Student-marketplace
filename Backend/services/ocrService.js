import Tesseract from "tesseract.js";
import sharp from "sharp";

export const extractTextFromImage = async (imageBuffer) => {
  try {
    // Image preprocessing for better OCR
    const processedImage = await sharp(imageBuffer)
      .resize({ width: 1600 })
      .grayscale()
      .normalize()
      .sharpen()
      .threshold(150)
      .toBuffer();

    const {
      data: { text },
    } = await Tesseract.recognize(processedImage, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const cleanedText = text
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();

    return cleanedText;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("OCR processing failed");
  }
};