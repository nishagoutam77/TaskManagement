const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/change-password', authController.changePassword);

// Get User Profile (protected route)
// router.get('/profile', authMiddleware, authController.getProfile);
// Logout API
// router.post('/logout', authController.logout);
// Update User Profile (protected)
// router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
