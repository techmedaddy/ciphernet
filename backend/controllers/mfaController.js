const speakeasy = require('speakeasy');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.generateMFA = async (req, res) => {
    const { userId } = req.body;

    const secret = speakeasy.generateSecret();
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    user.mfaSecret = secret.base32;
    await user.save();

    res.status(200).json({
        message: 'MFA setup successfully.',
        secret: secret.otpauth_url,
    });
};

exports.verifyMFA = async (req, res) => {
    const { userId, token } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
    });

    if (!verified) {
        return res.status(401).json({ error: 'Invalid MFA token.' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        message: 'MFA verified successfully.',
        token: jwtToken,
    });
};
