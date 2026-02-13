const User = require('../models/userModel');
const BandwidthLog = require('../models/bandwidthLogModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
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

    // Create bandwidth log for the new user (with default 30-day cycle)
    const cycleResetDate = new Date();
    cycleResetDate.setDate(cycleResetDate.getDate() + 30);
    
    await BandwidthLog.create({
        user: user._id,
        cycleResetDate
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
    }).select('+password +mfaSecret +mfaEnabled');

    if (!user) {
        return next(new AppError('Invalid credentials.', 401));
    }

    const isMatch = await user.matchPassword(password);

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

// MFA Setup - Generate secret and QR code
exports.setupMFA = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+mfaSecret +mfaEnabled');

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (user.mfaEnabled) {
        return next(new AppError('MFA is already enabled.', 400));
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
        name: `CipherNet (${user.email})`,
        length: 20
    });

    // Save the secret temporarily (not enabled yet)
    user.mfaSecret = secret.base32;
    await user.save({ validateBeforeSave: false });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({
        status: 'success',
        data: {
            secret: secret.base32,
            qrCode: qrCodeUrl
        }
    });
});

// MFA Verify - Verify token and enable MFA
exports.verifyMFA = asyncHandler(async (req, res, next) => {
    const { token, userId } = req.body;

    // If userId is provided, this is a login verification
    // Otherwise, it's enabling MFA for the current user
    const targetUserId = userId || req.user._id;

    const user = await User.findById(targetUserId).select('+mfaSecret +mfaEnabled +password');

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.mfaSecret) {
        return next(new AppError('MFA has not been set up for this account.', 400));
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 1 // Allow 1 step tolerance
    });

    if (!verified) {
        return next(new AppError('Invalid or expired OTP.', 401));
    }

    // If this is enabling MFA (not a login)
    if (!userId && !user.mfaEnabled) {
        user.mfaEnabled = true;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            status: 'success',
            message: 'MFA has been enabled successfully.'
        });
    }

    // If this is a login verification
    if (userId) {
        sendTokenResponse(user, 200, res);
        return;
    }

    res.status(200).json({
        status: 'success',
        message: 'OTP verified successfully.'
    });
});

// MFA Disable - Disable MFA for the user
exports.disableMFA = asyncHandler(async (req, res, next) => {
    const { token } = req.body;

    const user = await User.findById(req.user._id).select('+mfaSecret +mfaEnabled');

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    if (!user.mfaEnabled) {
        return next(new AppError('MFA is not enabled.', 400));
    }

    // Verify the token before disabling
    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 1
    });

    if (!verified) {
        return next(new AppError('Invalid or expired OTP.', 401));
    }

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'MFA has been disabled successfully.'
    });
});
