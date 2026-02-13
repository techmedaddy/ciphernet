// File: backend/routes/fileRoutes.js
const express = require('express');
const { 
    uploadFile, 
    downloadFile, 
    getFiles, 
    deleteFile 
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile: uploadMiddleware, checkFileExists } = require('../middleware/fileMiddleware');

const router = express.Router();

// Upload a file (with multer middleware)
router.post('/upload', protect, uploadMiddleware, checkFileExists, uploadFile);

// Get all files for current user
router.get('/', protect, getFiles);

// Download a specific file by ID
router.get('/download/:fileId', protect, downloadFile);

// Delete a file by ID
router.delete('/:fileId', protect, deleteFile);

module.exports = router;
