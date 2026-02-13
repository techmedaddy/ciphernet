const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// In-memory store for split tunneling rules (in production, use database)
const userTunnelRules = new Map();

/**
 * Add a split tunnel rule for an application or domain
 */
exports.addTunnel = asyncHandler(async (req, res, next) => {
    const { type, value, action } = req.body;
    const userId = req.user._id.toString();

    // Validate input
    if (!type || !value) {
        return next(new AppError('Please provide tunnel type and value.', 400));
    }

    if (!['app', 'domain', 'ip'].includes(type)) {
        return next(new AppError('Invalid tunnel type. Must be: app, domain, or ip.', 400));
    }

    if (!['include', 'exclude'].includes(action || 'include')) {
        return next(new AppError('Invalid action. Must be: include or exclude.', 400));
    }

    // Get or create user's tunnel rules
    if (!userTunnelRules.has(userId)) {
        userTunnelRules.set(userId, []);
    }

    const rules = userTunnelRules.get(userId);

    // Check for duplicate
    const exists = rules.find(r => r.type === type && r.value === value);
    if (exists) {
        return next(new AppError('This tunnel rule already exists.', 409));
    }

    // Add the rule
    const newRule = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        value,
        action: action || 'include',
        createdAt: new Date()
    };

    rules.push(newRule);

    res.status(201).json({
        status: 'success',
        message: 'Tunnel rule added successfully.',
        data: {
            rule: newRule
        }
    });
});

/**
 * Remove a split tunnel rule
 */
exports.removeTunnel = asyncHandler(async (req, res, next) => {
    const { ruleId } = req.body;
    const userId = req.user._id.toString();

    if (!ruleId) {
        return next(new AppError('Please provide the rule ID to remove.', 400));
    }

    const rules = userTunnelRules.get(userId);

    if (!rules || rules.length === 0) {
        return next(new AppError('No tunnel rules found.', 404));
    }

    const ruleIndex = rules.findIndex(r => r.id === ruleId);

    if (ruleIndex === -1) {
        return next(new AppError('Tunnel rule not found.', 404));
    }

    const removedRule = rules.splice(ruleIndex, 1)[0];

    res.status(200).json({
        status: 'success',
        message: 'Tunnel rule removed successfully.',
        data: {
            removedRule
        }
    });
});

/**
 * Get all tunnel rules for the current user
 */
exports.getTunnels = asyncHandler(async (req, res, next) => {
    const userId = req.user._id.toString();
    const rules = userTunnelRules.get(userId) || [];

    res.status(200).json({
        status: 'success',
        count: rules.length,
        data: {
            rules
        }
    });
});
