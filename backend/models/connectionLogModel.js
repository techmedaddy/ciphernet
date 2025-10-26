const mongoose = require('mongoose');

const connectionLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    serverLocation: { 
        type: String, 
        required: true 
    },
    ipAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['connected', 'disconnected', 'failed'],
        default: 'connected'
    },
    connectionTime: { 
        type: Date, 
        default: Date.now 
    },
    disconnectionTime: {
        type: Date
    },
    durationSeconds: {
        type: Number
    },
    dataUsage: { 
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('ConnectionLog', connectionLogSchema);
