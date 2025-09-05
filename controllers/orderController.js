const OrderService = require('../services/orderService');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderData = req.body;
        const result = await OrderService.createOrder(userId, orderData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all orders for a user
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await OrderService.getOrders(userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
