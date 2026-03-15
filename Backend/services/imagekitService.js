import imagekit from "../config/imagekit.js";

export const uploadImage = async (file) => {
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/student-marketplace",
    });

    return response.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Image upload failed");
  }
};