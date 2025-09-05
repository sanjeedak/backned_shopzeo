require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const bannerRoutes = require('./routes/banners');
const storeRoutes = require('./routes/stores');
const categoryHierarchyRoutes = require('./routes/categoryHierarchy');
const bulkImportRoutes = require('./routes/bulkImport');
const userAuthRoutes = require('./routes/userAuth');
const orderRoutes = require('./routes/orders'); // <-- ADD THIS LINE

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Shopzeo API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/category-hierarchy', categoryHierarchyRoutes);
app.use('/api/bulk-import', bulkImportRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/orders', orderRoutes); // <-- AND ADD THIS LINE

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
