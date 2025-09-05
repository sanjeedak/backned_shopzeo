const { Order, OrderItem, Product, Stock, sequelize } = require('../models');

// Function to create a new order
exports.createOrder = async (userId, orderData) => {
    const transaction = await sequelize.transaction();
    try {
        const { order_items, ...restOfOrderData } = orderData;
        
        const newOrder = await Order.create({
            ...restOfOrderData,
            user_id: userId,
        }, { transaction });

        if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        const itemsToCreate = await Promise.all(order_items.map(async item => {
            const product = await Product.findByPk(item.product_id, { transaction });
            if (!product) {
                throw new Error(`Product with ID ${item.product_id} not found`);
            }
            
            // Check stock availability
            const stock = await Stock.findOne({
                where: {
                    product_id: item.product_id,
                    variant_id: item.variant_id || null // Handle products without variants
                },
                transaction
            });

            if (!stock || stock.quantity < item.quantity) {
                throw new Error(`Not enough stock for product ID ${item.product_id}`);
            }

            // Decrease stock
            await stock.update({
                quantity: stock.quantity - item.quantity
            }, { transaction });

            return {
                order_id: newOrder.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: product.price,
                total_price: product.price * item.quantity
            };
        }));
        
        await OrderItem.bulkCreate(itemsToCreate, { transaction });

        await transaction.commit();

        return {
            success: true,
            message: 'Order created successfully',
            data: newOrder
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// Function to get orders for a user
exports.getOrders = async (userId) => {
    return Order.findAll({
        where: { user_id: userId },
        include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
                model: Product,
                as: 'product',
            }]
        }],
        order: [['created_at', 'DESC']]
    });
};
