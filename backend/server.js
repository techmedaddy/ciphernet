const http = require('http');
const app = require('./app'); // Express app
const initWebSocketServer = require('./utils/notificationUtils');

// HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initWebSocketServer(server);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
