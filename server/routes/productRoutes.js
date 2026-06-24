const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const requireAdmin = require('../middleware/requireAdmin');

const { getProducts, getProductById, addProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', verifyToken, requireAdmin, addProduct);

module.exports = router;


