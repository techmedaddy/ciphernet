const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.subscribe = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                { price: 'price_1Hh1vH2eZvKYlo2CbYbL9ZB2', quantity: 1 },
            ],
            mode: 'subscription',
            success_url: 'http://localhost:8080/success.html',
            cancel_url: 'http://localhost:8080/cancel.html',
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('[ERROR] Subscription failed:', error.message);
        res.status(500).json({ error: 'Failed to subscribe.' });
    }
};
