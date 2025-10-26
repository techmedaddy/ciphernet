const WebSocket = require('ws');

const initWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('[INFO] Client connected to WebSocket.');

        ws.on('message', (message) => {
            console.log(`[INFO] Received message: ${message}`);
        });

        ws.on('close', () => {
            console.log('[INFO] Client disconnected.');
        });

        ws.send(JSON.stringify({ message: 'Welcome to CipherNet notifications!' }));
    });

    return wss;
};

module.exports = initWebSocketServer;
