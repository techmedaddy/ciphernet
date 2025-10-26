const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Route for user registration
router.post('/register', async (req, res, next) => {
    try {
        console.log('[INFO] Registration request received');
        await register(req, res);
    } catch (error) {
        console.error('[ERROR] Registration failed:', error.message);
        next(error);
    }
});

// Route for user login
router.post('/login', async (req, res, next) => {
    try {
        console.log('[INFO] Login request received');
        await login(req, res);
    } catch (error) {
        console.error('[ERROR] Login failed:', error.message);
        next(error);
    }
});

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Auth service is healthy' });
});

module.exports = router;
