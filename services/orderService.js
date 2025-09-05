const { Op, Transaction } = require('sequelize');
const { 
  Order, 
  OrderItem, 
  Product, 
  Store, 
  User, 
  Address, 
  Wallet, 
  Transaction: WalletTransaction,
  Stock
} = require('../models'); // Ensure models are imported correctly via index.js or associations.js
const { AppError } = require('../middleware/errorHandler');

class OrderService {
  // Create new order (This is an improved version of your existing function)
  async createOrder(orderData, userId, transaction = null) {
    const {
      items,
      shippingAddress, // Now receiving the full address object
      billingAddress,
      paymentMethod,
      notes,
      couponCode
    } = orderData;

    if (!items || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }
    if (!shippingAddress) {
        throw new AppError('Shipping address is required', 400);
    }

    // Process items and calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        include: [{ model: Store, as: 'store' }]
      });

      if (!product || !product.isActive || !product.isApproved) {
        throw new AppError(`Product ${item.productId} is not available`, 400);
      }
      
      const currentStock = product.stock; // Assuming stock is a direct property of product for simplicity
      if (currentStock < item.quantity) {
        throw new AppError(`Insufficient stock for product ${product.name}`, 400);
      }
      
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      
      // Prepare data for OrderItem creation
      orderItemsData.push({
          productId: product.id,
          storeId: product.storeId,
          productName: product.name,
          productSku: product.sku,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemSubtotal,
          finalPrice: itemSubtotal // Assuming no tax/discount per item for now
      });

      // Decrement stock
      await product.decrement('stock', { by: item.quantity, transaction });
    }

    // TODO: Implement logic for tax, shipping, and discount calculation
    const taxAmount = subtotal * 0.05; // Example: 5% tax
    const shippingAmount = 80.00; // Example: flat shipping
    const discountAmount = 0; // TODO: implement coupon logic
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Create order
    const order = await Order.create({
      customerId: userId,
      shippingAddress: shippingAddress, // Storing the full JSON object
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      status: 'pending', // Order is pending until payment is confirmed
      paymentStatus: 'pending',
      notes,
    }, { transaction });
    
    // Create order items
    for (const itemData of orderItemsData) {
        itemData.orderId = order.id; // Assign the new orderId
    }
    await OrderItem.bulkCreate(orderItemsData, { transaction });

    return order;
  }
  
  // NEW FUNCTION: Confirm an order after successful payment
  async confirmOrder(orderId, transaction = null) {
    const order = await Order.findByPk(orderId);
    if (!order) {
        throw new AppError('Order not found', 404);
    }
    await order.update({
        status: 'confirmed',
        paymentStatus: 'paid'
    }, { transaction });
    // Here you can trigger notifications, etc.
    return order;
  }

  // NEW FUNCTION: Get all orders for a specific customer
  async getOrdersByCustomer(customerId) {
      return Order.findAll({
          where: { customerId },
          include: [{ model: OrderItem, as: 'items', include: [{model: Product, as: 'product'}] }],
          order: [['createdAt', 'DESC']]
      });
  }

  // NEW FUNCTION: Get a single order by ID for a specific customer
  async getOrderById(orderId, customerId) {
      return Order.findOne({
          where: { id: orderId, customerId },
          include: [{ model: OrderItem, as: 'items', include: [{model: Product, as: 'product'}] }]
      });
  }
}

module.exports = new OrderService();
