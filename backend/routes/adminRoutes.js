// routes/adminRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getAllUsers,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  createCategory,
  updateCategory
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Product validation
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('type')
    .isIn(['subscription', 'giftcard'])
    .withMessage('Type must be either subscription or giftcard'),
  body('categoryId')
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Short description must be less than 500 characters')
];

// Category validation
const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('type')
    .isIn(['subscription', 'giftcard'])
    .withMessage('Type must be either subscription or giftcard'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
];

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users management
router.get('/users', getAllUsers);

// Products management
router.post('/products', productValidation, createProduct);
router.put('/products/:id', productValidation, updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders management
router.get('/orders', getAllOrders);

// Categories management
router.post('/categories', categoryValidation, createCategory);
router.put('/categories/:id', categoryValidation, updateCategory);

module.exports = router;
