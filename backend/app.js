require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// CORS configuration to allow multiple origins
app.use(cors({
  origin: ['http://localhost:8080', 'http://172.24.240.1:8080'], // Allow frontend on port 8080
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If you're using cookies or need to send credentials
}));

// Enable preflight requests for all routes
app.options('*', cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/vpn', vpnRoutes);
app.use('/api/files', fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
});

module.exports = app;
