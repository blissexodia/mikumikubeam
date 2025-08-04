const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { Cart, CartItem, Product } = require('../models');

const router = express.Router();

// Validation for adding to cart
const addToCartValidation = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Add item to cart
router.post('/', authenticateToken, addToCartValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock !== null && quantity > product.stock) {
      return res.status(400).json({ message: 'Quantity exceeds available stock' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    res.json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sync local cart with server
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Clear existing cart items
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Add new items
    const cartItems = [];
    for (const item of items) {
      const product = await Product.findOne({ where: { id: item.productId, isActive: true } });
      if (!product) continue;

      if (product.stock !== null && item.quantity > product.stock) {
        continue;
      }

      const cartItem = await CartItem.create({
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity
      });
      cartItems.push(cartItem);
    }

    res.json({ message: 'Cart synced successfully', cartItems });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
const Coupon = require('../models/Coupon');

// Validate promo code
router.post('/coupons/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    res.json({ discountPercentage: coupon.discountPercentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;