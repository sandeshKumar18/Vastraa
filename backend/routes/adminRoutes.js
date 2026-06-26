const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
    try {
        // find all users in the database
        const users = await User.find({});
        
        // if successfully retrieved users, send them as JSON response
        res.json(users);
    } catch (error) {
        console.error("Admin Get Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/admin/users
// @desc Create a new user (Admin only)
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the email is already in use
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Create a new user
        user = new User({ name, email, password,role: role || "customer",});
        await user.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Admin Create User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update a user (Admin only)
// @access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.role = role || user.role;
        }
        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Admin Update User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user (Admin only)
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.remove();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Admin Delete User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;