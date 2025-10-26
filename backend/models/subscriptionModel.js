const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    plan: { 
        type: String, 
        enum: ['basic', 'premium', 'enterprise'], 
        required: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'pending', 'trial'],
        default: 'active'
    },
    stripeSubscriptionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripeCustomerId: {
        type: String
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
}, { timestamps: true });

subscriptionSchema.post('save', async function (doc, next) {
    const UserModel = mongoose.model('User');
    try {
        const user = await UserModel.findById(doc.user);
        if (!user) {
            return next(); 
        }

        if (doc.status === 'active' || doc.status === 'trial') {
            user.subscriptionStatus = doc.status;
        } else if (doc.status === 'cancelled' || doc.status === 'expired') {
            user.subscriptionStatus = 'lapsed';
        } else {
            user.subscriptionStatus = 'inactive';
        }
        
        await user.save();
        next();
    } catch (error) {
        console.error('Error synchronizing subscription status to user:', error);
        next(error);
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
