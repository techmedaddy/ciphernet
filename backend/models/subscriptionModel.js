const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['Basic', 'Premium', 'Enterprise'], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
