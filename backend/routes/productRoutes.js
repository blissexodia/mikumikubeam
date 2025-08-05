const express = require('express');
const { param } = require('express-validator');
const {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation for product ID
const validateProductId = [
  param('id').isUUID().withMessage('Invalid product ID')
];

// Public routes for products
router.get('/', getAllProducts);  // Get all products (no auth needed)
router.get('/featured', getFeaturedProducts);  // Get featured products (no auth needed)
router.get('/search', searchProducts);  // Search products (no auth needed)
router.get('/category/:categorySlug', getProductsByCategory);  // Get products by category (no auth needed)
router.get('/:id', validateProductId, getProductById);  // Get product by ID or slug (no auth needed)

module.exports = router;
