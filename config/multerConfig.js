const multer = require('multer');
const path = require('path');
const customId = require('../utils/customId'); // Mueve customId a utils

const storage = multer.diskStorage({
  destination: 'uploads/mobiliario',
  filename: (req, file, cb) => {
    cb(null, customId(req, true) + path.extname(file.originalname));
  }
});

module.exports = multer({ storage });