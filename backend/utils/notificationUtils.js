// File: backend/utils/notificationUtils.js

const WebSocket = require('ws');

// Initialize a WebSocket server
let wss;

function initializeWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('[INFO] New WebSocket connection established.');

        // Handle messages from the client
        ws.on('message', (message) => {
            console.log('[INFO] Received message from client:', message);
        });

        // Handle WebSocket connection closure
        ws.on('close', () => {
            console.log('[INFO] WebSocket connection closed.');
        });
    });

    console.log('[INFO] WebSocket server initialized.');
}

// Send a notification to a specific client
function sendNotificationToClient(client, notification) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
    }
}

// Broadcast a notification to all connected clients
function broadcastNotification(notification) {
    if (!wss) {
        console.error('[ERROR] WebSocket server not initialized.');
        return;
    }

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(notification));
        }
    });
}

// Example notification triggers
function sendHighBandwidthNotification(userId, bandwidthUsed, limit) {
    const notification = {
        type: 'HIGH_BANDWIDTH_USAGE',
        userId,
        message: `You have used ${bandwidthUsed} MB of your ${limit} MB bandwidth limit.`,
    };
    broadcastNotification(notification);
}

function sendTimeoutNotification(userId) {
    const notification = {
        type: 'SESSION_TIMEOUT',
        userId,
        message: 'Your VPN session has timed out.',
    };
    broadcastNotification(notification);
}

module.exports = {
    initializeWebSocket,
    sendNotificationToClient,
    broadcastNotification,
    sendHighBandwidthNotification,
    sendTimeoutNotification,
};
