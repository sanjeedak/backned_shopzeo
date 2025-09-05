const express = require('express');
const router = express.Router();

// Import the category controller functions
const categoryController = require('../controllers/categoryController');

// Define routes for categories
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
