const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Protected routes for orders
router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);

module.exports = router;
