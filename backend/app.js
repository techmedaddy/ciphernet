const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to CipherNet API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/vpn', vpnRoutes);
app.use('/api/subscription', subscriptionRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
