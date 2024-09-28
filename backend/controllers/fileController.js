// File: backend/controllers/fileController.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' });
    }
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  });
};

exports.downloadFile = (req, res) => {
  const file = path.resolve(__dirname, `../uploads/${req.params.filename}`);
  res.download(file);
};
