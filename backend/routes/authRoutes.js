const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    getMe,
    setupMFA,
    verifyMFA,
    disableMFA
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post('/mfa/setup', protect, setupMFA);
router.post('/mfa/verify', protect, verifyMFA);
router.post('/mfa/disable', protect, disableMFA);

module.exports = router;

