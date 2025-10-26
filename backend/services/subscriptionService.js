const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripeUtils = require('../utils/stripeUtils');
const AppError = require('../utils/appError');

exports.createSubscription = async (userId, plan, paymentMethodId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found.', 404);
    }

    const planDetails = stripeUtils.getPlanDetails(plan);
    if (!planDetails) {
        throw new AppError('Invalid subscription plan.', 400);
    }

    const stripeCustomer = await stripeUtils.findOrCreateCustomer(user.email, paymentMethodId);
    
    const stripeSub = await stripeUtils.createStripeSubscription(
        stripeCustomer.id, 
        planDetails.priceId,
        paymentMethodId
    );

    if (stripeSub.status !== 'active') {
        throw new AppError('Failed to create active Stripe subscription.', 500);
    }

    const newSubscription = new Subscription({
        user: userId,
        plan: plan,
        planId: planDetails.priceId,
        stripeSubscriptionId: stripeSub.id,
        status: stripeSub.status,
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    });

    await newSubscription.save();
    return newSubscription;
};

exports.cancelSubscription = async (userId) => {
    const subscription = await Subscription.findOne({ 
        user: userId, 
        status: 'active' 
    });
    
    if (!subscription) {
        throw new AppError('No active subscription found for this user.', 404);
    }

    const cancelledStripeSub = await stripeUtils.cancelStripeSubscription(
        subscription.stripeSubscriptionId
    );

    subscription.status = 'canceled';
    subscription.currentPeriodEnd = new Date(cancelledStripeSub.current_period_end * 1000);
    
    await subscription.save();
    return subscription;
};

exports.handleStripeWebhook = async (event) => {
    const subscription = event.data.object;

    switch (event.type) {
        case 'customer.subscription.deleted':
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: subscription.id },
                { status: 'canceled' }
            );
            break;
        case 'customer.subscription.updated':
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: subscription.id },
                { 
                    status: subscription.status,
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    plan: stripeUtils.getPlanNameByPriceId(subscription.items.data[0].price.id),
                    planId: subscription.items.data[0].price.id
                }
            );
            break;
        case 'invoice.payment_succeeded':
            if (subscription.billing_reason === 'subscription_cycle') {
                await Subscription.findOneAndUpdate(
                    { stripeSubscriptionId: subscription.subscription },
                    { 
                        status: 'active',
                        currentPeriodEnd: new Date(subscription.lines.data[0].period.end * 1000)
                    }
                );
            }
            break;
        case 'invoice.payment_failed':
            await Subscription.findOneAndUpdate(
                { stripeSubscriptionId: subscription.subscription },
                { status: 'past_due' }
            );
            break;
        default:
            console.log(`Unhandled webhook event type: ${event.type}`);
    }
};
