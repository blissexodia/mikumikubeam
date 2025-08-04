const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const db = require('./models');

// Load environment variables
dotenv.config();

const app = express();

// 🛡️ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Mock payment storage (replace with database in production)
const payments = new Map(); // Stores payment intents: { paymentId: { amount, currency, isPaid } }

// QR code payment routes
app.post('/api/payment/create-qr-intent', (req, res) => {
  try {
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

    const paymentId = uuidv4();
    const paymentUrl = `https://mikustore.com/pay/${paymentId}`; // Replace with actual payment provider URL (e.g., PayPal.me)
    payments.set(paymentId, { amount, currency, isPaid: false });

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/payment/check-qr-status/:paymentId', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = payments.get(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    // Mock payment check (replace with actual provider API call)
    const isPaid = payment.amount > 0; // Replace with real payment verification
    payment.isPaid = isPaid;
    res.json({ isPaid });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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