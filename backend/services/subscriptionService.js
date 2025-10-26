const Subscription = require('../models/subscriptionModel');
const stripeUtils = require('../utils/stripeUtils');

exports.createSubscription = async (userId, plan, token) => {
    const planDetails = stripeUtils.getPlanDetails(plan);

    const subscription = await stripeUtils.createStripeSubscription(token, planDetails);

    const newSubscription = new Subscription({
        user: userId,
        plan,
        startDate: new Date(),
        endDate: new Date(Date.now() + planDetails.duration),
    });

    await newSubscription.save();
    return newSubscription;
};

exports.cancelSubscription = async (userId) => {
    const subscription = await Subscription.findOne({ user: userId, active: true });
    if (!subscription) {
        throw new Error('No active subscription found for this user.');
    }

    subscription.active = false;
    await subscription.save();
};
