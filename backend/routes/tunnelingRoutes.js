const express = require('express');
const { addTunnel, removeTunnel } = require('../controllers/tunnelingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addTunnel);
router.post('/remove', authMiddleware, removeTunnel);

module.exports = router;
