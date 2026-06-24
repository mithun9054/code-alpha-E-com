const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    return res.status(200).json({
      success: true,
      message: 'Cart fetched',
      data: cart || { items: [] },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const { productId, quantity } = req.body || {};
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required', data: null });
    }

    const qty = quantity ? Number(quantity) : 1;
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be >= 1', data: null });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found', data: null });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((i) => String(i.product) === String(productId));
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: await Cart.findOne({ user: userId }).populate('items.product'),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const { itemId } = req.params;
    const { quantity } = req.body || {};

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'itemId is required', data: null });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be >= 1', data: null });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found', data: null });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found', data: null });
    }

    item.quantity = qty;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: await Cart.findOne({ user: userId }).populate('items.product'),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const { itemId } = req.params;
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'itemId is required', data: null });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found', data: null });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found', data: null });
    }

    item.remove();
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: await Cart.findOne({ user: userId }).populate('items.product'),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };


