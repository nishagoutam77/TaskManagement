const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    const category = new Category({ name });
    try {
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
