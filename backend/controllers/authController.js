const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Check if all required fields are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists. Please choose another.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        console.log('[INFO] User registered successfully:', username);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('[ERROR] Registration failed:', error.message);
        res.status(500).json({ error: 'Failed to register user.' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Check if all required fields are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('[INFO] User logged in successfully:', username);
        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error('[ERROR] Login failed:', error.message);
        res.status(500).json({ error: 'Failed to log in.' });
    }
};
