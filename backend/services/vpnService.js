const ConnectionLog = require('../models/connectionLogModel');
const Subscription = require('../models/subscriptionModel');
const BandwidthLog = require('../models/bandwidthLogModel');
const AppError = require('../utils/appError');
const vpnUtils = require('../utils/vpnUtils');

// Allow free tier for testing (set to false in production)
const ALLOW_FREE_TIER = process.env.ALLOW_FREE_TIER !== 'false';

exports.connect = async (userId, serverId, userIp) => {
    // Check subscription (skip if free tier allowed)
    if (!ALLOW_FREE_TIER) {
        const activeSub = await Subscription.findOne({ 
            user: userId, 
            status: { $in: ['active', 'trial'] }
        });

        if (!activeSub) {
            throw new AppError('No active subscription found. Please subscribe to connect.', 403);
        }
        
        if (activeSub.endDate && activeSub.endDate <= new Date()) {
            throw new AppError('Your subscription has expired.', 403);
        }

        // Check bandwidth quota
        const bandwidth = await BandwidthLog.findOne({ user: userId });
        if (bandwidth && bandwidth.isOverQuota()) {
            throw new AppError('You have exceeded your monthly bandwidth quota.', 403);
        }
    }

    // Find server
    const server = vpnUtils.getServerById(serverId);
    if (!server) {
        throw new AppError('Invalid server location. Use server ID like "us-east".', 400);
    }

    // Check for existing connection
    const existingConnection = await ConnectionLog.findOne({
        user: userId,
        status: 'connected'
    });
    if (existingConnection) {
        throw new AppError('Already connected to a VPN server. Disconnect first.', 409);
    }

    // Connect to server (simulated)
    const connectionDetails = await vpnUtils.connectToServer(server.ip, userId);

    // Create connection log
    const newLog = new ConnectionLog({
        user: userId,
        serverLocation: server.location,
        ipAddress: connectionDetails.assignedIp || `10.8.0.${Math.floor(Math.random() * 254) + 1}`,
        status: 'connected',
        connectionTime: new Date()
    });

    await newLog.save();

    return {
        connection: newLog,
        status: `Connected to ${server.location}`
    };
};

exports.disconnect = async (userId) => {
    // Find active connection from database
    const log = await ConnectionLog.findOne({
        user: userId,
        status: 'connected'
    }).sort({ connectionTime: -1 });

    if (!log) {
        throw new AppError('No active connection found.', 404);
    }

    // Disconnect from server (simulated)
    const usageReport = await vpnUtils.disconnectFromServer(log.ipAddress, userId);
    
    // Update connection log
    log.status = 'disconnected';
    log.disconnectionTime = new Date();
    
    // Calculate duration
    const durationMs = log.disconnectionTime - log.connectionTime;
    log.durationSeconds = Math.floor(durationMs / 1000);
    log.dataUsage = (usageReport.dataUploadedBytes || 0) + (usageReport.dataDownloadedBytes || 0);
    
    await log.save();

    // Update bandwidth log if exists
    const bandwidth = await BandwidthLog.findOne({ user: userId });
    if (bandwidth && log.dataUsage) {
        await bandwidth.addUsage(log.dataUsage);
    }

    return {
        status: 'Disconnected successfully',
        log: {
            durationMinutes: Math.round(log.durationSeconds / 60 * 10) / 10,
            dataDownloadedMB: Math.round((usageReport.dataDownloadedBytes || 0) / 1024 / 1024 * 100) / 100,
            dataUploadedMB: Math.round((usageReport.dataUploadedBytes || 0) / 1024 / 1024 * 100) / 100
        }
    };
};

exports.getConnectionStatus = async (userId) => {
    // Just check the database - don't verify with vpnUtils
    // In production, you'd verify with actual VPN software
    const log = await ConnectionLog.findOne({
        user: userId,
        status: 'connected'
    }).sort({ connectionTime: -1 });

    if (!log) {
        return { isConnected: false, connection: null };
    }

    return { 
        isConnected: true, 
        connection: {
            _id: log._id,
            serverLocation: log.serverLocation,
            connectionTime: log.connectionTime,
            clientIp: log.ipAddress
        }
    };
};

exports.getAvailableServers = () => {
    return vpnUtils.getAvailableServers();
};
