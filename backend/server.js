const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const paypal = require('@paypal/checkout-server-sdk');
const db = require('./models');

// Load environment variables
dotenv.config();

// Configure PayPal client
const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Middleware
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validate payment input middleware
const validatePaymentInput = (req, res, next) => {
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (currency !== 'USD') {
    return res.status(400).json({ error: 'Unsupported currency' });
  }
  next();
};

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Miku Miku Store Backend Running! 🎵',
    version: '1.0.0',
    status: 'active'
  });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

// QR code payment routes
app.post('/api/payment/create-qr-intent', validatePaymentInput, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentId = uuidv4();

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        },
        description: `Miku Miku Store Payment #${paymentId}`
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/order-confirmation`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`
      }
    });

    const response = await paypalClient.execute(request);
    const paypalOrderId = response.result.id;
    const paymentUrl = response.result.links.find(link => link.rel === 'approve').href;

    await db.Payment.create({
      id: paymentId,
      amount,
      currency,
      isPaid: false,
      paypalOrderId,
      orderId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ paymentUrl, paymentId });
  } catch (error) {
    console.error('QR payment creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

app.get('/api/payment/check-qr-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await db.Payment.findOne({ where: { id: paymentId } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    if (payment.isPaid) {
      return res.json({ isPaid: true });
    }

    const request = new paypal.orders.OrdersGetRequest(payment.paypalOrderId);
    const response = await paypalClient.execute(request);
    const isPaid = response.result.status === 'COMPLETED';
    
    if (isPaid) {
      payment.isPaid = true;
      await payment.save();
    }

    res.json({ isPaid });
  } catch (error) {
    console.error('QR payment status check error:', error);
    res.status(500).json({ 
      message: 'Failed to check payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

app.post('/api/payment/confirm-qr/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await db.Payment.findOne({ where: { id: paymentId } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    payment.isPaid = true;
    await payment.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Failed to confirm payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);  // Log the request path
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🎵 Miku Miku Store Backend is ready!`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
});
