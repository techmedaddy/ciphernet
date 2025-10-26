// File: backend/models/bandwidthLogModel.js

const mongoose = require('mongoose');

// Define the Bandwidth Log schema
const bandwidthLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    bandwidthUsed: {
        type: Number,
        default: 0, // Bandwidth usage in MB or GB (depending on your requirement)
    },
    limit: {
        type: Number,
        default: 1024, // Default limit in MB (1 GB)
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now, // Automatically sets the last updated time
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Middleware to update `lastUpdated` field
bandwidthLogSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

// Static method to reset bandwidth usage (e.g., for monthly resets)
bandwidthLogSchema.statics.resetBandwidthUsage = async function () {
    await this.updateMany({}, { $set: { bandwidthUsed: 0 } });
};

// Export the Bandwidth Log model
module.exports = mongoose.model('BandwidthLog', bandwidthLogSchema);
