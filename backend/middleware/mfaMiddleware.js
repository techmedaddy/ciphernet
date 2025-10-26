const twilio = require('twilio');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = async (req, res, next) => {
    const { otp, userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user || user.otp !== otp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Generate a new JWT after OTP verification
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'MFA successful', token });
    } catch (error) {
        console.error('[ERROR] MFA Middleware:', error.message);
        res.status(500).json({ error: 'MFA validation failed.' });
    }
};
