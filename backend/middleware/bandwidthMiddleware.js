const ConnectionLog = require('../models/connectionLogModel');

module.exports = async (req, res, next) => {
    const { userId } = req.user;

    try {
        const connectionLog = await ConnectionLog.findOne({ user: userId }).sort({ connectionTime: -1 });

        if (!connectionLog) {
            return res.status(404).json({ error: 'No active VPN connection found.' });
        }

        // Assume the limit is 1GB (1024MB)
        const bandwidthLimitMB = 1024;

        if (connectionLog.dataUsage >= bandwidthLimitMB) {
            return res.status(403).json({ error: 'Bandwidth limit exceeded. Disconnecting VPN.' });
        }

        next();
    } catch (error) {
        console.error('[ERROR] Bandwidth Middleware:', error.message);
        res.status(500).json({ error: 'Failed to monitor bandwidth.' });
    }
};
