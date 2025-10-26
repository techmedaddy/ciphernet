const User = require('../models/userModel');
const BandwidthLog = require('../models/bandwidthLogModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateJwtToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            status: 'success',
            token,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
};

exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(new AppError('Please provide a username, email, and password.', 400));
    }
    
    const user = await User.create({
        username,
        email,
        password
    });

    await BandwidthLog.create({
        user: user._id
    });

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully. Please log in.'
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        return next(new AppError('Please provide an email/username and password.', 400));
    }

    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }).select('+password');

    if (!user) {
        return next(new AppError('Invalid credentials.', 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new AppError('Invalid credentials.', 401));
    }
    
    if (user.mfaEnabled) {
        return res.status(200).json({
            status: 'mfa_required',
            message: 'Please provide OTP to complete login.',
            userId: user._id
        });
    }

    sendTokenResponse(user, 200, res);
});

exports.generateMFA = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    const secret = speakeasy.generateSecret({
        name: `CipherNet (${user.email})`
    });
    
    user.mfaSecret = secret.base32;
    user.mfaEnabled = false; 
    await user.save({ validateBeforeSave: false });

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(200).json({
        status: 'success',
        data: {
            qrCodeDataUrl,
            secret: secret.base32 
        }
    });
});

exports.enableMFA = asyncHandler(async (req, res, next) => {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select('+mfaSecret');

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.mfaSecret) {
        return next(new AppError('MFA secret not generated. Please generate one first.', 400));
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 1
    });

    if (!verified) {
        return next(new AppError('Invalid OTP. MFA setup failed.', 401));
    }

    user.mfaEnabled = true;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'MFA enabled successfully.'
    });
});

exports.verifyMFALogin = asyncHandler(async (req, res, next) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return next(new AppError('Please provide a userId and OTP token.', 400));
    }
    
    const user = await User.findById(userId).select('+mfaSecret');

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.mfaEnabled || !user.mfaSecret) {
        return next(new AppError('MFA is not enabled for this user.', 400));
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token,
        window: 1
    });

    if (!verified) {
        return next(new AppError('Invalid OTP.', 401));
    }

    sendTokenResponse(user, 200, res);
});

exports.disableMFA = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'MFA disabled successfully.'
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully.'
    });
};

