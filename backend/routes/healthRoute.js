// File: backend/routes/healthRoute.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

module.exports = router;

// In app.js or server.js, include the route
const healthRoute = require('./routes/healthRoute');
app.use('/health', healthRoute);
