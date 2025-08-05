const { validationResult } = require('express-validator');
const { Order, OrderItem, Product, User, Payment } = require('../models');
const paypal = require('@paypal/checkout-server-sdk');

const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Create new order
const createOrder = async (req, res) => {
  const transaction = await require('../models').sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, paymentMethod, shippingInfo } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate PayPal payment if applicable
    let paymentVerified = false;
    if (['paypal', 'qrCode'].includes(paymentMethod)) {
      const paymentId = req.headers['x-payment-id'];
      if (!paymentId) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Payment ID required for PayPal or QR code payment' });
      }
      const payment = await Payment.findOne({ where: { paymentId } });
      if (!payment || !payment.isPaid) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Payment not completed or not found' });
      }
      const paypalRequest = new paypal.orders.OrdersGetRequest(payment.paypalOrderId);
      const paypalResponse = await paypalClient.execute(paypalRequest);
      if (paypalResponse.result.status !== 'COMPLETED') {
        await transaction.rollback();
        return res.status(400).json({ message: 'PayPal payment not completed' });
      }
      paymentVerified = true;
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product || !product.isActive) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Product ${item.productId} not found or inactive` 
        });
      }

      // Check stock if applicable
      if (product.stock !== null && product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
        productImage: product.image,
        productMetadata: {
          type: product.type,
          duration: product.duration,
          features: product.features
        }
      });
    }

    // Get user info
    const user = userId ? await User.findByPk(userId) : null;

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      paymentMethod,
      customerEmail: shippingInfo?.email || user?.email || 'guest@example.com',
      customerName: shippingInfo?.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Guest'),
      status: paymentVerified ? 'processing' : 'pending',
      paymentStatus: paymentVerified ? 'paid' : 'pending',
      shippingInfo: shippingInfo || null
    }, { transaction });

    // Create order items
    for (const orderItem of orderItems) {
      await OrderItem.create({
        ...orderItem,
        orderId: order.id
      }, { transaction });

      // Update stock if applicable
      const product = await Product.findByPk(orderItem.productId);
      if (product.stock !== null) {
        await product.update({
          stock: product.stock - orderItem.quantity
        }, { transaction });
      }
    }

    await transaction.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'image', 'type']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder,
      orderId: order.id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'image', 'type']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const whereClause = { id };
    if (!isAdmin) {
      whereClause.userId = userId;
    }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'image', 'type', 'description']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes !== undefined) updateData.notes = notes;

    // Set delivered date if status is completed
    if (status === 'completed' && order.status !== 'completed') {
      updateData.deliveredAt = new Date();
    }

    await order.update(updateData);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'image', 'type']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};