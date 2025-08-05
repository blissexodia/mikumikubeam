const express = require('express');
const { body, param } = require('express-validator');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const db = require('../models');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
];

const updateOrderValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'completed', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
];

const orderIdValidation = [
  param('id').isUUID().withMessage('Invalid order ID')
];

// Protected routes
router.post('/', authenticateToken, createOrderValidation, createOrder);  // Create order
router.get('/user', authenticateToken, getUserOrders);  // Get orders of the user
router.get('/:id', authenticateToken, orderIdValidation, getOrderById);  // Get order details by ID

// Public route for order details QR code
router.get('/details/:orderId', orderIdValidation, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [
        { model: db.OrderItem, include: [db.Product] },
        { model: db.User, attributes: ['id', 'email'] }
      ]
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({
      orderId: order.id,
      userEmail: order.User.email,
      items: order.OrderItems.map(item => ({
        productId: item.Product.id,
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error('❌ Order details error:', error);
    res.status(500).json({
      message: 'Failed to fetch order details',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Admin route to update order status
router.put('/:id/status', authenticateToken, requireAdmin, orderIdValidation, updateOrderValidation, updateOrderStatus);

module.exports = router;
