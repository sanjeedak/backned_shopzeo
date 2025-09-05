    const express = require('express');
    const router = express.Router();
    const userAuthController = require('../controllers/userAuthController');
    const { protect } = require('../middleware/userAuth');
    const rateLimit = require('express-rate-limit'); // Add this line to import the package

    // Apply rate limiting to all auth routes to prevent brute-force attacks
    router.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50, // Limit each IP to 50 requests per window
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }));

    router.post('/register', userAuthController.register);
    router.post('/login', userAuthController.login);
    router.post('/request-otp', userAuthController.requestOtp);
    router.post('/verify-otp', userAuthController.verifyOtp);
    router.post('/forgot-password', userAuthController.forgotPassword);
    router.post('/reset-password', userAuthController.resetPassword);

    // Protected routes (user must be logged in)
    router.get('/me', protect, userAuthController.getMe);
    router.put('/update-details', protect, userAuthController.updateDetails);
    router.put('/update-password', protect, userAuthController.updatePassword);

    module.exports = router;
    
