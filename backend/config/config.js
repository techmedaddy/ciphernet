// We must load dotenv here to read the .env file
require('dotenv').config();
const mongoose = require('mongoose');

// Validate essential environment variables
if (!process.env.DB_URI) {
    throw new Error('FATAL ERROR: DB_URI is not defined in .env file');
}
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in .env file');
}
if (!process.env.ENCRYPTION_KEY) {
    throw new Error('FATAL ERROR: ENCRYPTION_KEY is not defined in .env file');
}

// Database connection function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

// Stripe price IDs for subscription plans
const stripePriceIds = {
    basic: process.env.STRIPE_PRICE_BASIC || 'price_basic_placeholder',
    premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_placeholder',
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder'
};

module.exports = connectDB;

module.exports.dbURI = process.env.DB_URI;
module.exports.jwtSecret = process.env.JWT_SECRET;
module.exports.encryptionKey = process.env.ENCRYPTION_KEY;
module.exports.stripePriceIds = stripePriceIds;
module.exports.stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
