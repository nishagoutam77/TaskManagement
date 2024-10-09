const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        // Check if each product ID in the array is valid
        for (let i = 0; i < products.length; i++) {
            const productId = products[i].product;

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: `Invalid product ID: ${productId}` });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found for ID: ${productId}` });
            }

            // Add more logic if needed to check stock or other details
        }

        // Create a new order associated with the authenticated user
        const order = new Order({
            user: req.user._id,   // User ID from auth middleware
            products: products,   // Array of product and quantity
            totalAmount: totalAmount
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createOrder, getOrders };




// const Order = require('../models/orderModel');

// exports.createOrder = async (req, res) => {
//     const { products, totalAmount } = req.body;
//     const order = new Order({ user: req.user.id, products, totalAmount });
//     try {
//         await order.save();
//         res.status(201).json(order);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user.id }).populate('products.product');
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
