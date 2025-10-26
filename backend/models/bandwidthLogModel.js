const mongoose = require('mongoose');

const bandwidthLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    bandwidthUsedBytes: {
        type: Number,
        default: 0,
    },
    quotaBytes: {
        type: Number,
        required: true,
        default: 1073741824, // 1 GB
    },
    cycleStartDate: {
        type: Date,
        default: Date.now
    },
    cycleResetDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

bandwidthLogSchema.methods.addUsage = async function (bytes) {
    this.bandwidthUsedBytes += bytes;
    return this.save();
};

bandwidthLogSchema.methods.isOverQuota = function () {
    return this.bandwidthUsedBytes >= this.quotaBytes;
};

bandwidthLogSchema.methods.resetCycle = function (newResetDate, newQuotaBytes) {
    this.bandwidthUsedBytes = 0;
    this.cycleStartDate = new Date();
    this.cycleResetDate = newResetDate;
    if (newQuotaBytes) {
        this.quotaBytes = newQuotaBytes;
    }
    return this.save();
};

bandwidthLogSchema.statics.resetExpiredCycles = async function () {
    const now = new Date();
    const expiredDocs = await this.find({ cycleResetDate: { $lte: now } });
    
    for (const doc of expiredDocs) {
        const newResetDate = new Date(doc.cycleResetDate);
        newResetDate.setMonth(newResetDate.getMonth() + 1);
        
        await doc.resetCycle(newResetDate);
    }
};

module.exports = mongoose.model('BandwidthLog', bandwidthLogSchema);
