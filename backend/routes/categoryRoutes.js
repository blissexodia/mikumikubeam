// routes/categoryRoutes.js
const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  getCategoriesByType
} = require('../controllers/categoryController');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/type/:type', getCategoriesByType);
router.get('/:id', getCategoryById);

module.exports = router;