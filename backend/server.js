const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models');

// 🎸 Load environment variables
dotenv.config();

const app = express();

// 🛡️ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🎹 Validate payment input middleware
const validatePaymentInput = (req, res, next) => {
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (currency !== 'usd') {
    return res.status(400).json({ error: 'Unsupported currency' });
  }
  next();
};

// 🎻 Define Payment model for Sequelize
const Payment = db.sequelize.define('Payment', {
  paymentId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'payments',
  timestamps: true
});

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Miku Miku Store Backend Running! 🎵',
    version: '1.0.0',
    status: 'active'
  });
});

// 📦 Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');

// 🧩 Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

// 🎤 QR code payment routes
app.post('/api/payment/create-qr-intent', validatePaymentInput, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentId = uuidv4();
    const paymentUrl = `https://mikustore.com/pay/${paymentId}`; // Replace with actual payment provider URL (e.g., PayPal.me)

    await Payment.create({
      paymentId,
      amount,
      currency,
      isPaid: false
    });

    res.json({ paymentUrl });
  } catch (error) {
    console.error('❌ QR payment creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

app.get('/api/payment/check-qr-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ where: { paymentId } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ isPaid: payment.isPaid });
  } catch (error) {
    console.error('❌ QR payment status check error:', error);
    res.status(500).json({ 
      message: 'Failed to check payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// 🎵 Mock webhook for payment confirmation (replace with actual provider webhook)
app.post('/api/payment/confirm-qr/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ where: { paymentId } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    payment.isPaid = true;
    await payment.save();
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// 🚫 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 🚨 Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database (use { force: true } only in development to reset tables)
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🎵 Miku Miku Store Backend is ready!`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
});