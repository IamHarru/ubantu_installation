const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: "us-east-1", // change if needed
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET, // <-- ONLY ONE BUCKET
    key: (req, file, cb) => {
      const fileName =
        crypto.randomBytes(12).toString("hex") +
        path.extname(file.originalname);
      cb(null, `uploads/${fileName}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

module.exports = upload;
