// File: backend/routes/vpnRoutes.js
const express = require('express');
const { connectVPN, disconnectVPN } = require('../controllers/vpnController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/connect', authMiddleware, async (req, res, next) => {
    try {
        await connectVPN(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/disconnect', authMiddleware, async (req, res, next) => {
    try {
        await disconnectVPN(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;