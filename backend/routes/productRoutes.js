// routes/productRoutes.js
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

const validateProductId = [
  param('id').isUUID().withMessage('Invalid product ID')
];

// Public product routes
router.get('/', optionalAuth, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/:id', optionalAuth, validateProductId, getProductById);

module.exports = router;
