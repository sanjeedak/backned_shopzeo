const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
// This line fixes the circular dependency by correctly importing the 'protect' middleware from auth.js
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Apply rate limiting to all auth routes to prevent brute-force attacks
router.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes'
}));

// Route functions corrected to match the controller exports
router.post('/register', userAuthController.signup);
router.post('/login', userAuthController.login);

// Corrected 'verifyOtp' to 'verifyOTP' to match the controller file
router.post('/verify-otp', userAuthController.verifyOTP);

// The controller file you provided does not contain functions for the following routes.
// To prevent crashes, these routes are commented out.
// router.post('/request-otp', userAuthController.requestOtp);
// router.post('/forgot-password', userAuthController.forgotPassword);
// router.post('/reset-password', userAuthController.resetPassword);

// Corrected protected routes to match controller function names
router.get('/me', protect, userAuthController.getProfile);
router.put('/update-details', protect, userAuthController.updateProfile);
router.put('/update-password', protect, userAuthController.changePassword);

module.exports = router;
