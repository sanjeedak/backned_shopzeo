const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();

const { sequelize } = require('./config/sequelize');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const adminRoutes = require('./routes/admin');
const userAuthRoutes = require('./routes/userAuth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const bannerRoutes = require('./routes/banners');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const bulkImportRoutes = require('./routes/bulkImport');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const supportRoutes = require('./routes/support');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');
const storesRoutes = require('./routes/stores');
const usersRoutes = require('./routes/users');
const walletsRoutes = require('./routes/wallets');
const categoryHierarchyRoutes = require('./routes/categoryHierarchy');

// Use Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api/bulk-import', bulkImportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/wallets', walletsRoutes);
app.use('/api/category-hierarchy', categoryHierarchyRoutes);

// Test Database Connection
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testDbConnection();

// Simple API response for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the ShopZeo Backend API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});