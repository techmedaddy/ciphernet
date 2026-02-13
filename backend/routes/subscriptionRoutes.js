const express = require('express');
const { 
    createCheckoutSession, 
    handleStripeWebhook 
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a Stripe checkout session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Stripe webhook handler (no auth - Stripe calls this)
// Note: needs raw body parser for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
