// routes/otpRoutes.js
const express = require('express');
const { sendOtp } = require('../controllers/otpController');

const router = express.Router();

// POST route to send OTP
router.post('/send-otp', sendOtp);

module.exports = router;
