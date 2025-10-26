const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPlanDetails = (plan) => {
    const plans = {
        Basic: { price: 500, duration: 30 * 24 * 60 * 60 * 1000 },
        Premium: { price: 1000, duration: 30 * 24 * 60 * 60 * 1000 },
        Enterprise: { price: 2000, duration: 30 * 24 * 60 * 60 * 1000 },
    };
    return plans[plan];
};

exports.createStripeSubscription = async (token, planDetails) => {
    return await stripe.paymentIntents.create({
        amount: planDetails.price,
        currency: 'usd',
        payment_method_types: ['card'],
        confirm: true,
        payment_method: token,
    });
};
