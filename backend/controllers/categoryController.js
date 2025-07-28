// controllers/categoryController.js
const { Category, Product } = require('../models');
const { Op } = require('sequelize');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { type, includeProducts = false } = req.query;

    const whereClause = { isActive: true };
    if (type) {
      whereClause.type = type;
    }

    const includeOptions = [];
    if (includeProducts === 'true') {
      includeOptions.push({
        model: Product,
        as: 'products',
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'slug', 'price', 'image', 'isFeatured']
      });
    }

    const categories = await Category.findAll({
      where: whereClause,
      include: includeOptions,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single category by ID or slug
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      where: {
        [Op.or]: [{ id }, { slug: id }],
        isActive: true
      },
      include: [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'price', 'originalPrice', 'image', 'shortDescription', 'isFeatured'],
          order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get categories by type
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['subscription', 'giftcard'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const categories = await Category.findAll({
      where: {
        type,
        isActive: true
      },
      include: [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'slug', 'price', 'image', 'isFeatured'],
          limit: 6 // Show only first 6 products for each category
        }
      ],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({ 
      type,
      categories 
    });
  } catch (error) {
    console.error('Get categories by type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoriesByType
};