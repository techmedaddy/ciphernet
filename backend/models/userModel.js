// File: backend/models/userModel.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure that usernames are unique
        trim: true, // Trim whitespace from the username
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum length for password (can be adjusted)
    }
}, { timestamps: true }); // Optional: Add timestamps for createdAt and updatedAt

// Export the User model
module.exports = mongoose.model('User', userSchema);
