const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// Correct the import statement to use 'authenticate' from auth.js
const { authenticate } = require('../middleware/auth');

// Protected routes for orders
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);

module.exports = router;