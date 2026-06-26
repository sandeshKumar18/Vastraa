const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const fs = require("fs");
const path = require("path");
const router = express.Router();


require("dotenv").config();

// Configure Cloudinary with credentials from environment variables 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memeory storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let imageUrl = "";

    // Check if Cloudinary is configured and doesn't contain placeholders
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
                                   process.env.CLOUDINARY_API_KEY &&
                                   process.env.CLOUDINARY_API_SECRET &&
                                   !process.env.CLOUDINARY_API_SECRET.includes('*');

    if (isCloudinaryConfigured) {
      try {
        // function to upload the file buffer to Cloudinary
        const streamUpload = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            });
            // use streamifier to create a readable stream from the file buffer and pipe it to Cloudinary's upload stream
            streamifier.createReadStream(fileBuffer).pipe(stream);
          });
        };

        // call the streamUpload function with the file buffer from multer
        const result = await streamUpload(req.file.buffer);
        imageUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed, falling back to local storage:", cloudinaryError);
      }
    } else {
      console.log("Cloudinary is not configured or uses placeholders. Using local storage fallback.");
    }

    // If Cloudinary is not configured or failed, fall back to local disk storage
    if (!imageUrl) {
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(req.file.originalname) || ".jpg";
      const filename = `${uniqueSuffix}${fileExtension}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      console.log("Image saved locally:", imageUrl);
    }

    // Respond with the URL of the uploaded image
    res.json({ imageUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;