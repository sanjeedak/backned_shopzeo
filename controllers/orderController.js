const { sequelize } = require('../models');
const orderService = require('../services/orderService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Creates a new order from the items in the cart.
 * This function uses a transaction to ensure all database operations succeed or none do.
 */
exports.createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const orderData = req.body;
    const userId = req.user.id; // Assuming `protect` middleware adds user to req

    // The main logic for creating the order is in the orderService
    const newOrder = await orderService.createOrder(orderData, userId, transaction);
    
    // For a real application, you would integrate a payment gateway here.
    // For now, we will just confirm the order if the payment method is Cash on Delivery.
    if (orderData.paymentMethod === 'cod') {
        await orderService.confirmOrder(newOrder.id, transaction);
    }
    
    // If everything is successful, commit the transaction
    await transaction.commit();
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    // If any step fails, roll back the entire transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Gets all orders for the currently authenticated user.
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByCustomer(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets a single order by its ID, ensuring it belongs to the authenticated user.
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

