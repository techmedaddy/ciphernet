const vpnService = require('../services/vpnService');
const ConnectionLog = require('../models/connectionLogModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { getAvailableServers } = require('../utils/vpnUtils');

exports.connectToVpn = asyncHandler(async (req, res, next) => {
    const { serverLocation } = req.body;
    const userId = req.user._id;

    if (!serverLocation) {
        return next(new AppError('Please provide a server location.', 400));
    }

    const { connection, status } = await vpnService.connect(userId, serverLocation);

    res.status(200).json({
        status: 'success',
        message: status,
        data: {
            connectionId: connection._id,
            serverLocation: connection.serverLocation
        }
    });
});

exports.disconnectFromVpn = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { status, log } = await vpnService.disconnect(userId);

    res.status(200).json({
        status: 'success',
        message: status,
        data: {
            durationMinutes: log.durationMinutes,
            dataDownloadedMB: log.dataDownloadedMB,
            dataUploadedMB: log.dataUploadedMB
        }
    });
});

exports.getConnectionStatus = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const log = await ConnectionLog.findOne({ 
        user: userId, 
        status: 'active' 
    });

    if (!log) {
        return res.status(200).json({
            status: 'success',
            data: {
                isConnected: false,
                connection: null
            }
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            isConnected: true,
            connection: {
                _id: log._id,
                serverLocation: log.serverLocation,
                connectionTime: log.connectionTime,
                clientIp: log.clientIp
            }
        }
    });
});

exports.getVpnServers = asyncHandler(async (req, res, next) => {
    const servers = getAvailableServers();
    res.status(200).json({
        status: 'success',
        count: servers.length,
        data: {
            servers
        }
    });
});
