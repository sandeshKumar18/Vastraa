 const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        // find all orders in the database and populate user information
        // get all orders from the database and include the user's name and email in the response
        const orders = await Order.find({}).populate("user", "name email");
        
        res.json(orders);
    } catch (error) {
        console.error("Admin Get Orders Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // update the order status based on the request body
            order.status = req.body.status || order.status;

            // 2. if the status is "Delivered", mark the order as delivered and set the deliveredAt timestamp
            order.isDelivered = 
                req.body.status === "Delivered" ? true : order.isDelivered;

            // 3. set the deliveredAt timestamp
            order.deliveredAt = 
                req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Order Status Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // 1. \given the order ID from the request parameters, find the order in the database
        const order = await Order.findById(req.params.id);

        if (order) {
            // 2. given the order exists, delete it from the database
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            // 3. given the order is not found, return a 404 error
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Order Delete Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});




module.exports = router;