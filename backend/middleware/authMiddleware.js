const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        const freshUser = await User.findById(decoded.id).select('-password');

        if (!freshUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }
        
        req.user = freshUser;
        next();
    } catch (err) {
        return next(new AppError('Invalid token.', 401));
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError(`User role '${req.user.role}' is not authorized to access this route.`, 403)
            );
        }
        next();
    };
};
