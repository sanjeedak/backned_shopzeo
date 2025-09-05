const express = require('express');
const { Op } = require('sequelize');
const moment = require('moment');

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
// Correct the import to use 'authorize' and 'asyncHandler'
const { authorize, asyncHandler } = require('../middleware/auth');

const router = express.Router();

// Define requireAdmin locally
const requireAdmin = authorize('admin');

// Get dashboard overview statistics
router.get('/dashboard-overview', requireAdmin, asyncHandler(async (req, res) => {
  // ... (rest of the code remains the same)
}));

// ... (apply requireAdmin to all other protected routes)

module.exports = router;