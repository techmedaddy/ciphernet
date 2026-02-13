const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Plan details mapping
const PLAN_DETAILS = {
    basic: {
        name: 'Basic',
        priceId: process.env.STRIPE_PRICE_BASIC || 'price_basic_placeholder',
        bandwidthGB: 10
    },
    premium: {
        name: 'Premium',
        priceId: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_placeholder',
        bandwidthGB: 100
    },
    enterprise: {
        name: 'Enterprise',
        priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
        bandwidthGB: -1 // Unlimited
    }
};

/**
 * Get plan details by plan name
 */
exports.getPlanDetails = (planName) => {
    return PLAN_DETAILS[planName.toLowerCase()] || null;
};

/**
 * Get plan name by Stripe price ID
 */
exports.getPlanNameByPriceId = (priceId) => {
    for (const [planName, details] of Object.entries(PLAN_DETAILS)) {
        if (details.priceId === priceId) {
            return planName;
        }
    }
    return 'unknown';
};

/**
 * Find or create a Stripe customer
 */
exports.findOrCreateCustomer = async (email, paymentMethodId) => {
    // Search for existing customer
    const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
    });

    if (existingCustomers.data.length > 0) {
        const customer = existingCustomers.data[0];
        
        // Attach new payment method if provided
        if (paymentMethodId) {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id
            });
            
            await stripe.customers.update(customer.id, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });
        }
        
        return customer;
    }

    // Create new customer
    const customerData = { email };
    
    if (paymentMethodId) {
        customerData.payment_method = paymentMethodId;
        customerData.invoice_settings = {
            default_payment_method: paymentMethodId
        };
    }

    return await stripe.customers.create(customerData);
};

/**
 * Create a Stripe subscription
 */
exports.createStripeSubscription = async (customerId, priceId, paymentMethodId) => {
    const subscriptionData = {
        customer: customerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent']
    };

    if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId;
    }

    return await stripe.subscriptions.create(subscriptionData);
};

/**
 * Cancel a Stripe subscription
 */
exports.cancelStripeSubscription = async (subscriptionId) => {
    return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
    });
};

/**
 * Immediately cancel a Stripe subscription
 */
exports.cancelStripeSubscriptionImmediately = async (subscriptionId) => {
    return await stripe.subscriptions.cancel(subscriptionId);
};
