// File: backend/routes/vpnRoutes.js
const express = require('express');
const { 
    connectToVpn, 
    disconnectFromVpn, 
    getConnectionStatus, 
    getVpnServers 
} = require('../controllers/vpnController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Connect to VPN
router.post('/connect', protect, connectToVpn);

// Disconnect from VPN
router.post('/disconnect', protect, disconnectFromVpn);

// Get current connection status
router.get('/status', protect, getConnectionStatus);

// Get available VPN servers
router.get('/servers', protect, getVpnServers);

module.exports = router;
