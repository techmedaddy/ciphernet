const ConnectionLog = require('../models/connectionLogModel');
const Subscription = require('../models/subscriptionModel');
const BandwidthLog = require('../models/bandwidthLogModel');
const AppError = require('../utils/appError');
const vpnUtils = require('../utils/vpnUtils');

const DUMMY_SERVER_LIST = [
    { id: 'us-east', location: 'New York, USA', ip: '123.45.67.89' },
    { id: 'eu-west', location: 'London, UK', ip: '98.76.54.32' },
    { id: 'asia-east', location: 'Tokyo, Japan', ip: '101.12.13.14' },
];

exports.connect = async (userId, serverId, userIp) => {
    const activeSub = await Subscription.findOne({ 
        user: userId, 
        status: 'active' 
    });

    if (!activeSub) {
        throw new AppError('No active subscription found. Please subscribe to connect.', 403);
    }
    
    if (activeSub.currentPeriodEnd <= new Date()) {
        throw new AppError('Your subscription has expired.', 403);
    }

    const bandwidth = await BandwidthLog.findOne({ user: userId });
    if (bandwidth && bandwidth.isOverQuota()) {
        throw new AppError('You have exceeded your monthly bandwidth quota.', 403);
    }

    const server = DUMMY_SERVER_LIST.find(s => s.id === serverId);
    if (!server) {
        throw new AppError('Invalid server location.', 400);
    }

    const existingConnection = await ConnectionLog.findOne({
        user: userId,
        status: 'connected'
    });
    if (existingConnection) {
        throw new AppError('User is already connected to a VPN server.', 409);
    }

    const connectionDetails = await vpnUtils.connectToServer(server.ip, userId);

    const newLog = new ConnectionLog({
        user: userId,
        serverLocation: server.location,
        serverIp: server.ip,
        userIp: userIp,
        status: 'connected',
    });

    await newLog.save();

    return {
        status: 'success',
        connectionLogId: newLog._id,
        server: server,
        connectionInfo: connectionDetails
    };
};

exports.disconnect = async (userId, connectionLogId) => {
    const log = await ConnectionLog.findOne({
        _id: connectionLogId,
        user: userId
    });

    if (!log) {
        throw new AppError('No active connection log found to disconnect.', 404);
    }
    
    if (log.status === 'disconnected') {
        return { status: 'success', message: 'Already disconnected.' };
    }

    const usageReport = await vpnUtils.disconnectFromServer(log.serverIp, userId);
    
    log.status = 'disconnected';
    log.disconnectTime = new Date();
    log.dataUploadedBytes = usageReport.dataUploadedBytes || 0;
    log.dataDownloadedBytes = usageReport.dataDownloadedBytes || 0;
    await log.save();

    const bandwidth = await BandwidthLog.findOne({ user: userId });
    if (bandwidth) {
        const totalUsage = usageReport.dataUploadedBytes + usageReport.dataDownloadedBytes;
        await bandwidth.addUsage(totalUsage);
    }

    return {
        status: 'success',
        usageReport
    };
};

exports.getConnectionStatus = async (userId) => {
    const log = await ConnectionLog.findOne({
        user: userId,
        status: 'connected'
    }).sort({ connectionTime: -1 });

    if (!log) {
        return { status: 'disconnected', message: 'No active connection.' };
    }

    const isOsConnected = await vpnUtils.getStatus(log.serverIp, userId);

    if (isOsConnected) {
        return { status: 'connected', log };
    } else {
        await this.disconnect(userId, log._id);
        return { status: 'disconnected', message: 'Cleaned up stale connection.' };
    }
};

exports.getAvailableServers = async () => {
    return DUMMY_SERVER_LIST.map(server => {
        return {
            id: server.id,
            location: server.location,
            load: Math.floor(Math.random() * 80) + 10 
        };
    });
};
