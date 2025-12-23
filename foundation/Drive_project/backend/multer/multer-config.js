const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const storage = multer.diskStorage({
    destination: "./upload/",
    filename: (req, file, cb) => {
        cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
module.exports = upload;