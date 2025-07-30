// routes/orderRoutes.js
const express = require('express');
const { body, param } = require('express-validator');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

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
router.post('/', authenticateToken, createOrderValidation, createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, orderIdValidation, getOrderById);

// Admin route
router.put('/:id/status', authenticateToken, requireAdmin, orderIdValidation, updateOrderValidation, updateOrderStatus);

module.exports = router;
