const express = require('express');
const { addTunnel, removeTunnel, getTunnels } = require('../controllers/tunnelingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tunnel rules for current user
router.get('/', protect, getTunnels);

// Add a new tunnel rule
router.post('/add', protect, addTunnel);

// Remove a tunnel rule
router.post('/remove', protect, removeTunnel);

module.exports = router;
