const BandwidthLog = require('../models/bandwidthLogModel');

exports.monitorBandwidth = async (req, res) => {
    try {
        const { userId } = req.body;
        const usage = await BandwidthLog.findOne({ user: userId });

        if (!usage) {
            return res.status(404).json({ error: 'No bandwidth usage found for this user.' });
        }

        res.status(200).json({ bandwidthUsed: usage.bandwidthUsed, limit: usage.limit });
    } catch (error) {
        console.error('[ERROR] Bandwidth monitoring failed:', error.message);
        res.status(500).json({ error: 'Failed to monitor bandwidth.' });
    }
};

exports.restrictBandwidth = async (req, res) => {
    try {
        const { userId, bandwidthUsed } = req.body;

        const usage = await BandwidthLog.findOne({ user: userId });
        if (!usage) {
            return res.status(404).json({ error: 'No bandwidth usage found for this user.' });
        }

        if (bandwidthUsed > usage.limit) {
            return res.status(403).json({ error: 'Bandwidth limit exceeded. VPN connection terminated.' });
        }

        res.status(200).json({ message: 'Bandwidth is within the limit.' });
    } catch (error) {
        console.error('[ERROR] Restricting bandwidth failed:', error.message);
        res.status(500).json({ error: 'Failed to restrict bandwidth.' });
    }
};
