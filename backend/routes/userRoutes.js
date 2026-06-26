const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user @route POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Create and save the new user
        user = new User({ name, email, password });
        await user.save();

        // 3. Create JWT token
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;

                // 4. Send token AND user details in a single JSON response
                res.status(201).json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );
       
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Server Error");
    }
});

// Login user @route POST /api/users/login
// @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Compare passwords
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Create JWT token
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                // 4. Send token AND user details in a single JSON response
                res.json({
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send("Server Error");
    }
});

// @riute GET /api/users/profile
// @access Private
router.get('/profile',protect, async (req, res) => {
    res.json(req.user);
}); 

module.exports = router;