// At the very top, load environment variables from .env file
require('dotenv').config();

const http = require('http');
const app = require('./app'); // Your main Express app
const initWebSocketServer = require('./utils/notificationUtils'); // Your WebSocket setup

// Get port from environment variables, with a default
const PORT = process.env.PORT || 3001;

// Create HTTP server with the Express app
const server = http.createServer(app);

// Initialize WebSocket server
initWebSocketServer(server);

// --- Add Robust Server Error Handling ---
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`❌ ${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`❌ ${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
    // Note: If your database connection is asynchronous,
    // ensure it completes (e.g., in app.js) before this point.
});