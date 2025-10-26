const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const subscriptionService = require('../services/subscriptionService');
const { stripePriceIds, stripeWebhookSecret } = require('../config/config');

exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
    const { plan } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!plan || !stripePriceIds[plan]) {
        return next(new AppError('Invalid subscription plan specified.', 400));
    }

    const priceId = stripePriceIds[plan];

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        client_reference_id: req.user._id.toString(),
        customer_email: user.email,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`,
    });

    res.status(200).json({
        status: 'success',
        data: {
            sessionId: session.id,
            url: session.url
        }
    });
});

exports.handleStripeWebhook = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
    } catch (err) {
        console.error(`[ERROR] Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object;

    switch (event.type) {
        case 'checkout.session.completed': {
            const userId = session.client_reference_id;
            const stripeSubscriptionId = session.subscription;
            const customerEmail = session.customer_email;

            if (session.payment_status === 'paid') {
                await subscriptionService.fulfillSubscription(userId, stripeSubscriptionId, customerEmail);
                console.log(`[INFO] Subscription fulfilled for user ${userId}`);
            }
            break;
        }
        
        case 'invoice.payment_failed': {
            const stripeSubscriptionId = session.subscription;
            await subscriptionService.handleSubscriptionPaymentFailed(stripeSubscriptionId);
            console.log(`[INFO] Subscription payment failed for ${stripeSubscriptionId}`);
            break;
        }

        case 'customer.subscription.deleted': {
            const stripeSubscriptionId = session.id;
            await subscriptionService.handleSubscriptionCancellation(stripeSubscriptionId);
            console.log(`[INFO] Subscription cancelled for ${stripeSubscriptionId}`);
            break;
        }
        
        default:
            console.log(`[INFO] Unhandled Stripe event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
});

