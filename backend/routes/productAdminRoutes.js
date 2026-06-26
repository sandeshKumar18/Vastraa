const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        // find all products in the database
        const products = await Product.find({});
        
        // if successfully retrieved products, send them as JSON response
        res.json(products);
    } catch (error) {
        console.error("Admin Get Products Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/admin/products
// @desc Create a new product (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id 
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Admin Create Product Error:", error);
        res.status(500).send("Server Error");
    }
});

// @route PUT /api/admin/products/:id
// @desc Update a product (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product fields
        Object.assign(product, req.body);
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error("Admin Update Product Error:", error);
        res.status(500).send("Server Error");
    }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne(); 
        res.json({ message: "Product removed" });
    } catch (error) {
        console.error("Admin Delete Product Error:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;