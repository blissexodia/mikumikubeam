const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { Cart, CartItem, Product, Coupon } = require('../models');

const router = express.Router();

// Validation for adding/updating cart items
const cartItemValidation = [
  body('productId').isUUID().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

// Get user’s cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image', 'stock', 'slug', 'categoryId'],
              include: [
                {
                  model: require('../models').Category,
                  as: 'category',
                  attributes: ['name']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!cart) {
      return res.json({ cartItems: [] });
    }

    const cartItems = cart.cartItems.map(item => ({
      cartId: cart.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        image: item.product.image,
        stock: item.product.stock,
        slug: item.product.slug,
        category: item.product.category ? { name: item.product.category.name } : { name: 'Uncategorized' }
      }
    }));

    res.json({ cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving cart',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Add item to cart
router.post('/', authenticateToken, cartItemValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    if (product.stock !== null && quantity > product.stock) {
      return res.status(400).json({ message: `Requested quantity (${quantity}) exceeds available stock (${product.stock})` });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      cartItem.quantity = Math.min(cartItem.quantity + quantity, product.stock || 99);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    const updatedCartItem = await CartItem.findOne({
      where: { id: cartItem.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock', 'slug', 'categoryId'],
          include: [
            {
              model: require('../models').Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Item added to cart',
      cartItem: {
        cartId: cart.id,
        productId: updatedCartItem.productId,
        quantity: updatedCartItem.quantity,
        product: {
          id: updatedCartItem.product.id,
          name: updatedCartItem.product.name,
          price: parseFloat(updatedCartItem.product.price),
          image: updatedCartItem.product.image,
          stock: updatedCartItem.product.stock,
          slug: updatedCartItem.product.slug,
          category: updatedCartItem.product.category ? { name: updatedCartItem.product.category.name } : { name: 'Uncategorized' }
        }
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Server error adding to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Update cart item quantity
router.put('/', authenticateToken, cartItemValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findOne({ where: { id: productId, isActive: true } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }

    if (product.stock !== null && quantity > product.stock) {
      return res.status(400).json({ message: `Requested quantity (${quantity}) exceeds available stock (${product.stock})` });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({ message: 'Item removed from cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCartItem = await CartItem.findOne({
      where: { id: cartItem.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image', 'stock', 'slug', 'categoryId'],
          include: [
            {
              model: require('../models').Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Cart item updated',
      cartItem: {
        cartId: cart.id,
        productId: updatedCartItem.productId,
        quantity: updatedCartItem.quantity,
        product: {
          id: updatedCartItem.product.id,
          name: updatedCartItem.product.name,
          price: parseFloat(updatedCartItem.product.price),
          image: updatedCartItem.product.image,
          stock: updatedCartItem.product.stock,
          slug: updatedCartItem.product.slug,
          category: updatedCartItem.product.category ? { name: updatedCartItem.product.category.name } : { name: 'Uncategorized' }
        }
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      message: 'Server error updating cart item',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Remove item from cart
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: 'Server error removing item from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.json({ message: 'Cart already empty' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      message: 'Server error clearing cart',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Sync local cart with server
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
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
      if (!item.productId || !item.quantity) {
        continue;
      }

      const product = await Product.findOne({ where: { id: item.productId, isActive: true } });
      if (!product) {
        continue;
      }

      if (product.stock !== null && item.quantity > product.stock) {
        continue;
      }

      const cartItem = await CartItem.create({
        cartId: cart.id,
        productId: item.productId,
        quantity: Math.min(item.quantity, product.stock || 99)
      });

      const populatedCartItem = await CartItem.findOne({
        where: { id: cartItem.id },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image', 'stock', 'slug', 'categoryId'],
            include: [
              {
                model: require('../models').Category,
                as: 'category',
                attributes: ['name']
              }
            ]
          }
        ]
      });

      cartItems.push({
        cartId: cart.id,
        productId: populatedCartItem.productId,
        quantity: populatedCartItem.quantity,
        product: {
          id: populatedCartItem.product.id,
          name: populatedCartItem.product.name,
          price: parseFloat(populatedCartItem.product.price),
          image: populatedCartItem.product.image,
          stock: populatedCartItem.product.stock,
          slug: populatedCartItem.product.slug,
          category: populatedCartItem.product.category ? { name: populatedCartItem.product.category.name } : { name: 'Uncategorized' }
        }
      });
    }

    res.json({ message: 'Cart synced successfully', cartItems });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({ 
      message: 'Server error syncing cart',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Validate promo code
router.post('/coupons/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), isActive: true } });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid promo code' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    res.json({ discountPercentage: coupon.discountPercentage });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ 
      message: 'Server error validating coupon',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;
