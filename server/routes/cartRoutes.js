const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.put('/:itemId', verifyToken, updateCartItem);
router.delete('/:itemId', verifyToken, removeCartItem);

module.exports = router;

