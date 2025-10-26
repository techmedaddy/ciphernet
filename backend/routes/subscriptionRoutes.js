const express = require('express');
const { createSubscription, cancelSubscription, getSubscriptionDetails } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, createSubscription);
router.post('/cancel', authMiddleware, cancelSubscription);
router.get('/details', authMiddleware, getSubscriptionDetails);

module.exports = router;
