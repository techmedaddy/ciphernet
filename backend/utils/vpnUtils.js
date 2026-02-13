// File: backend/utils/vpnUtils.js

// Available VPN servers
const AVAILABLE_SERVERS = [
    { id: 'us-east', location: 'New York, USA', ip: '123.45.67.89', load: 45 },
    { id: 'us-west', location: 'Los Angeles, USA', ip: '123.45.67.90', load: 32 },
    { id: 'eu-west', location: 'London, UK', ip: '98.76.54.32', load: 67 },
    { id: 'eu-central', location: 'Frankfurt, Germany', ip: '98.76.54.33', load: 51 },
    { id: 'asia-east', location: 'Tokyo, Japan', ip: '101.12.13.14', load: 28 },
    { id: 'asia-south', location: 'Singapore', ip: '101.12.13.15', load: 39 },
];

// Simulated active connections (in production, this would interface with actual VPN software)
const activeConnections = new Map();

/**
 * Get list of available VPN servers
 */
exports.getAvailableServers = () => {
    return AVAILABLE_SERVERS.map(server => ({
        id: server.id,
        location: server.location,
        load: Math.floor(Math.random() * 80) + 10 // Simulated load
    }));
};

/**
 * Simulate connecting to a VPN server
 */
exports.connectToServer = async (serverIp, userId) => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const connectionId = `conn_${Date.now()}_${userId}`;
    
    activeConnections.set(connectionId, {
        userId,
        serverIp,
        connectedAt: new Date(),
        bytesUploaded: 0,
        bytesDownloaded: 0
    });

    console.log(`[VPN] User ${userId} connected to server ${serverIp}`);

    return {
        connectionId,
        server: serverIp,
        connected: true,
        assignedIp: `10.8.0.${Math.floor(Math.random() * 254) + 1}`,
        connectedAt: new Date()
    };
};

/**
 * Simulate disconnecting from a VPN server
 */
exports.disconnectFromServer = async (serverIp, userId) => {
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 50));

    // Find and remove the connection
    for (const [connId, conn] of activeConnections.entries()) {
        if (conn.userId.toString() === userId.toString() && conn.serverIp === serverIp) {
            activeConnections.delete(connId);
            break;
        }
    }

    console.log(`[VPN] User ${userId} disconnected from server ${serverIp}`);

    // Return simulated usage data
    return {
        dataUploadedBytes: Math.floor(Math.random() * 50000000), // Up to 50MB
        dataDownloadedBytes: Math.floor(Math.random() * 200000000), // Up to 200MB
        disconnectedAt: new Date()
    };
};

/**
 * Check if a user is connected to a specific server
 */
exports.getStatus = async (serverIp, userId) => {
    for (const [, conn] of activeConnections.entries()) {
        if (conn.userId.toString() === userId.toString() && conn.serverIp === serverIp) {
            return true;
        }
    }
    return false;
};

/**
 * Get server by ID
 */
exports.getServerById = (serverId) => {
    return AVAILABLE_SERVERS.find(s => s.id === serverId);
};
