const express = require('express');
const router = express.Router();
// Sahi middleware file se 'authenticate' aur 'authorize' import karein
const { authenticate, authorize } = require('../middleware/auth');

// Middleware to check if user is admin, using the 'authorize' function from auth.js
const requireAdmin = authorize('admin');

// Public admin login page (no auth required)
router.get('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Admin login endpoint',
    data: {
      endpoint: '/api/user-auth/login',
      required_fields: ['email', 'password'],
      role: 'admin'
    }
  });
});

// Protected admin routes (require admin authentication)
router.use(authenticate); // Apply authentication to all routes below
router.use(requireAdmin); // Apply admin-only authorization to all routes below

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Dashboard',
    data: {
      dashboard: 'Shopzeo Admin Dashboard',
      status: 'active',
      timestamp: new Date().toISOString(),
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        is_verified: req.user.is_verified
      }
    }
  });
});

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Profile',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        is_verified: req.user.is_verified
      }
    }
  });
});

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    message: 'Admin Statistics',
    data: {
      stats: {
        total_orders: 190,
        total_stores: 10,
        total_products: 402,
        total_customers: 7,
        pending_orders: 58,
        confirmed_orders: 21,
        delivered_orders: 77,
        earnings: {
          in_house: 39892.00,
          commission: 12755.02,
          delivery_charge: 1360.00
        }
      }
    }
  });
});

// Catch-all route for admin panel
router.get('*', (req, res) => {
  res.json({
    success: false,
    message: 'Admin route not found',
    data: {
      available_routes: [
        'GET /admin/login - Admin login info',
        'GET /admin/dashboard - Dashboard (Auth required)',
        'GET /admin/profile - Profile (Auth required)',
        'GET /admin/stats - Statistics (Auth required)'
      ]
    }
  });
});

module.exports = router;