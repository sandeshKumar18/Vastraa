const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);
    
   // if successfully created, create an order and clear the cart
    res.status(201).json(newCheckout);
    
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (paymentStatus === "paid") {
            // update checkout to mark as paid
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();

            const updatedCheckout = await checkout.save();

            res.status(200).json(updatedCheckout);
        } else {
            res.status(400).json({ message: "Invalid Payment Status" });
        }
    } catch (error) {
        console.error("Payment Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        // 1. check if the checkout is paid and not already finalized
        if (checkout.isPaid && !checkout.isFinalized) {
            
            // 2. create a new order based on the checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems, 
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            });

            // 3. mark the checkout as finalized to prevent duplicate orders
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // 4. clear the cart after finalizing the order
            const cart = await Cart.findOne({ user: checkout.user });
            if (cart) {
                cart.products = [];
                cart.totalPrice = 0;
                await cart.save();
                console.log(`Cart cleared for user: ${checkout.user}`);
            } else {
                console.log(`No cart found to clear for user: ${checkout.user}`);
            }

            res.status(201).json(finalOrder);

        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" });
        } else {
            res.status(400).json({ message: "Checkout is not paid" });
        }
    } catch (error) {
        console.error("Finalize Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;