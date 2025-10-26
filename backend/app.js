// Load environment variables from .env file
require('dotenv').config();

const express = 'express';
const cors = require('cors');
const helmet = require('helmet'); // Secures your app by setting various HTTP headers
const morgan =require('morgan'); // HTTP request logger middleware
const connectDB = require('./config/config'); // We will create this for DB connection
const authRoutes = require('./routes/authRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const fileRoutes = require('./routes/fileRoutes'); // Added this from your file structure
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler'); // Custom error handlers

// --- Connect to Database ---
// We call the function from our config file
connectDB();

const app = express();

// --- Core Middleware ---

// 1. Set security HTTP headers
app.use(helmet());

// 2. Enable CORS
// Your original config is good and specific.
// For more flexible development, you could just use app.use(cors());
app.use(cors({ origin: 'http://localhost:8080' }));

// 3. Logger (using 'dev' format for concise, colored output)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Body Parsers
app.use(express.json()); // To accept JSON payloads
app.use(express.urlencoded({ extended: true })); // To accept URL-encoded payloads

// --- API Routes ---
// We'll version our API to make future updates cleaner
const apiVersion = '/api/v1';

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the CipherNet API',
        status: 'OK',
        apiVersion: '1.0.0'
    });
});

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/vpn`, vpnRoutes);
app.use(`${apiVersion}/files`, fileRoutes); // Mounted the file routes
app.use(`${apiVersion}/subscription`, subscriptionRoutes);

// --- Custom Error Handling Middleware ---
// 404 Handler (if no routes match)
// This MUST be after all your routes
app.use(notFound);

// Global Error Handler (catches all errors)
// This MUST be the last piece of middleware
app.use(errorHandler);

module.exports = app;
