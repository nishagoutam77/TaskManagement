const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

// Register User
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = new User({ username, email });
        user.setPassword(password);  // Hashing the password with salt
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.verifyPassword(password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Forgot Password - Send OTP via Email
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpired = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        await user.save();

        // Send OTP to user's email
        const subject = 'Your Password Reset OTP';
        const message = `Your OTP for resetting the password is: ${otp}. It will expire in 10 minutes.`;

        await sendEmail(user.email, subject, message);

        res.status(200).json({ message: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp });
        if (!user || user.otpExpired < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        res.status(200).json({ message: 'OTP verified' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not matchhh" });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update and hash the new password
        user.setPassword(newPassword);
        user.otp = null; // Clear OTP after password change (if OTP verification was part of the process)
        
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from the token (set in auth middleware)
        const user = await User.findById(userId).select('-password -salt -otp -otpExpired'); // Exclude sensitive fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logout User (For client-side confirmation)
exports.logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assumes you have the userId from the auth middleware (JWT)

        // Get the fields to update from the request body
        const { username, email } = req.body;

        // Validate if the email or username already exists in the system
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        if (existingUsername && existingUsername._id.toString() !== userId) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Find the user by ID and update
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile with new data
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save(); // Save updated user data to the database

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};