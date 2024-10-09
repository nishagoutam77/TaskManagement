const Product = require('../models/productModel');

exports.createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const product = new Product({ name, description, price, category, stock });
    try {
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    const { search, category } = req.query;
    try {
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // case-insensitive search
        }
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
