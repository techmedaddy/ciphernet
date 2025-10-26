const BandwidthLog = require('../models/bandwidthLogModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const bandwidthCheckMiddleware = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    if (!userId) {
        return next(new AppError('User not found. This middleware must be used after "protect".', 401));
    }

    const bandwidthLog = await BandwidthLog.findOne({ user: userId });

    if (!bandwidthLog) {
        return next(new AppError('No bandwidth log found for this user. Subscription may be incomplete.', 404));
    }

    if (bandwidthLog.isOverQuota()) {
        return next(new AppError('Bandwidth limit exceeded. Please upgrade your plan or wait for the next cycle.', 403));
    }

    next();
});

module.exports = bandwidthCheckMiddleware;
