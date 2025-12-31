const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");

const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,

    key: (req, file, cb) => {
      try {
        // 🔐 Decode JWT manually (CRITICAL FIX)
        const token = req.cookies?.token;
        if (!token) {
          return cb(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(token, process.env.JWT_token);
        const userId = decoded.id;

        const fileName =
          crypto.randomBytes(12).toString("hex") +
          path.extname(file.originalname);

        // ✅ Store files per user
        cb(null, `users/${userId}/${fileName}`);

      } catch (err) {
        cb(new Error("Invalid token"));
      }
    },

    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (optional but recommended)
  },
});

module.exports = upload;
