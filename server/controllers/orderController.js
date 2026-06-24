const Cart = require('../models/Cart');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty', data: null });
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.product.price,
    }));

    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    const order = await Order.create({
      user: userId,
      items,
      total,
      status: 'Processing',
    });

    // clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order created',
      data: order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', data: null });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');

    return res.status(200).json({ success: true, message: 'Orders fetched', data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

module.exports = { createOrder, getOrders };


