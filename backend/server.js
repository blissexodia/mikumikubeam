// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

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

// 🧩 Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

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