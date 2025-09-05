const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const { protect } = require('../middleware/userAuth');
const rateLimit = require('express-rate-limit'); // This line imports the package

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
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

/**
 * Middleware to protect routes by verifying a JWT.
 * It checks for a valid token in the authorization header,
 * verifies it, and attaches the authenticated user to the request object.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to the request object
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      
      if(!req.user){
        return next(new AppError('The user belonging to this token no longer exists.', 401));
      }

      return next(); // Ensure we call next() on success
    } catch (error) {
      // Handle specific JWT errors for better client feedback
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Your session has expired. Please log in again.', 401));
      }
      return next(new AppError('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }
};

/**
 * Middleware to authorize users based on their roles.
 * This should be used AFTER the `protect` middleware.
 * @param  {...String} roles - A list of roles that are allowed to access the route (e.g., 'admin', 'vendor').
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user should be available from the `protect` middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403) // 403 Forbidden
      );
    }
    next();
  };
};

// Exporting an object containing both middleware functions
module.exports = {
  protect,
  authorize,
};

