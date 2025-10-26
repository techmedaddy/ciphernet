const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { jwtSecret } = require('../config/config');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = asyncHandler(async (req, res, next) => {
    const { otp, userId } = req.body;

    if (!otp || !userId) {
        return next(new AppError('Please provide OTP and User ID.', 400));
    }

    const user = await User.findById(userId).select('+otp +otpExpires');

    if (!user) {
        return next(new AppError('Invalid OTP or User.', 401));
    }
    
    const isMatch = (otp === user.otp);
    if (!isMatch) {
        return next(new AppError('Invalid OTP.', 401));
    }

    if (user.otpExpires < Date.now()) {
        return next(new AppError('OTP has expired. Please request a new one.', 401));
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    const token = user.generateJwtToken();

    res.status(200).json({
        status: 'success',
        message: 'MFA successful',
        token
    });
});
