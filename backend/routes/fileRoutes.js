// File: backend/routes/fileRoutes.js
const express = require('express');
const { uploadFile, downloadFile } = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');
const fileMiddleware = require('../middleware/fileMiddleware');
const router = express.Router();

router.post('/upload', authMiddleware, fileMiddleware, async (req, res, next) => {
    try {
        await uploadFile(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/download/:filename', authMiddleware, async (req, res, next) => {
    try {
        await downloadFile(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;