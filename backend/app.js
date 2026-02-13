// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Secures your app by setting various HTTP headers
const morgan = require('morgan'); // HTTP request logger middleware
const connectDB = require('./config/config'); // Database connection
const authRoutes = require('./routes/authRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const fileRoutes = require('./routes/fileRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const tunnelingRoutes = require('./routes/tunnelingRoutes');
const healthRoutes = require('./routes/healthRoute');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// --- Connect to Database ---
connectDB();

const app = express();

// --- Core Middleware ---

// 1. Set security HTTP headers
app.use(helmet());

// 2. Enable CORS (allow multiple origins for development)
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Be permissive in development
        }
    },
    credentials: true
}));

// 3. Logger (using 'dev' format for concise, colored output)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Body Parsers
app.use(express.json()); // To accept JSON payloads
app.use(express.urlencoded({ extended: true })); // To accept URL-encoded payloads

// --- API Routes ---
const apiVersion = '/api/v1';

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the CipherNet API',
        status: 'OK',
        apiVersion: '1.0.0',
        endpoints: {
            auth: `${apiVersion}/auth`,
            vpn: `${apiVersion}/vpn`,
            files: `${apiVersion}/files`,
            subscription: `${apiVersion}/subscription`,
            tunneling: `${apiVersion}/tunneling`,
            health: `${apiVersion}/health`
        }
    });
});

// Mount routes
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/vpn`, vpnRoutes);
app.use(`${apiVersion}/files`, fileRoutes);
app.use(`${apiVersion}/subscription`, subscriptionRoutes);
app.use(`${apiVersion}/tunneling`, tunnelingRoutes);
app.use(`${apiVersion}/health`, healthRoutes);

// --- Custom Error Handling Middleware ---
// 404 Handler (if no routes match)
app.use(notFound);

// Global Error Handler (catches all errors)
app.use(errorHandler);

module.exports = app;
