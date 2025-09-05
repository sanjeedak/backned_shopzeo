const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
// Correct the import statement to pull 'authenticate' and 'rateLimit' from the correct middleware file
const { authenticate, rateLimit } = require('../middleware/auth');

// Apply rate limiting to all auth routes
router.use(rateLimit(50, 15 * 60 * 1000)); // 50 requests per 15 minutes

// Public routes (no authentication required)
router.post('/signup', userAuthController.signupValidation, userAuthController.signup);
router.post('/login', userAuthController.loginValidation, userAuthController.login);
router.post('/verify-otp', userAuthController.otpValidation, userAuthController.verifyOTP);

// Protected routes (authentication required)
router.use(authenticate); // Apply the correct authentication middleware to all routes below

router.get('/profile', userAuthController.getProfile);
router.put('/profile', userAuthController.updateProfile);
router.post('/change-password', userAuthController.changePassword);
router.post('/logout', userAuthController.logout);
router.post('/refresh-token', userAuthController.refreshToken);

module.exports = router;