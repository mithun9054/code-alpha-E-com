const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query || {};

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Products fetched', data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found', data: null });
    }

    return res.status(200).json({ success: true, message: 'Product fetched', data: product });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message || 'Invalid product id', data: null });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body || {};

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'name and price are required', data: null });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    return res.status(201).json({ success: true, message: 'Product added', data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error', data: null });
  }
};

module.exports = { getProducts, getProductById, addProduct };


