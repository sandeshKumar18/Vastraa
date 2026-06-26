const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();


const { protect } = require('../middleware/authMiddleware'); 

// Helper function to get or create a cart
const getCart = async (userId, guestId) => {
    const cleanUserId = (userId && userId !== "null" && userId !== "undefined") ? userId : null;
    const cleanGuestId = (guestId && guestId !== "null" && guestId !== "undefined") ? guestId : null;

    const query = [];
    if (cleanUserId) {
        query.push({ user: cleanUserId });
    }
    if (cleanGuestId) {
        query.push({ guestId: cleanGuestId });
    }

    if (query.length > 0) {
        return await Cart.findOne({ $or: query });
    }
    return null;
};

// @route POST /api/cart
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            const cleanUserId = (userId && userId !== "null" && userId !== "undefined") ? userId : null;
            const cleanGuestId = (guestId && guestId !== "null" && guestId !== "undefined") ? guestId : null;

            const newCart = await Cart.create({
                user: cleanUserId ? cleanUserId : undefined,
                guestId: cleanGuestId ? cleanGuestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                }],
                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/cart
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);

    if (!cart) {
      const cleanUserId = (userId && userId !== "null" && userId !== "undefined") ? userId : null;
      const cleanGuestId = (guestId && guestId !== "null" && guestId !== "undefined") ? guestId : null;

      const newCart = await Cart.create({
        user: cleanUserId ? cleanUserId : undefined,
        guestId: cleanGuestId ? cleanGuestId : "guest_" + new Date().getTime(),
        products: [{
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity: quantity > 0 ? quantity : 1,
        }],
        totalPrice: product.price * (quantity > 0 ? quantity : 1),
      });

      return res.status(201).json(newCart);
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId &&
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/cart
router.delete("/", async (req, res) => {
    const {productId, size, color, guestId, userId} = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            // If the cart doesn't exist in the database (e.g. database was wiped),
            // return a successful empty cart so the client can synchronize and clear local storage.
            return res.status(200).json({ products: [], totalPrice: 0 });
        }
        
       const productIndex = cart.products.findIndex(  
            (p) =>
                p.productId &&
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Product is already not in the cart, return success with the current cart
            return res.status(200).json(cart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// @route GET /api/cart
router.get("/", async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if(cart) {
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/cart/merge
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (!guestCart) {
            return res.status(200).json(userCart || { products: [], totalPrice: 0 });
        }

        if (guestCart.products.length === 0) {
            return res.status(200).json(userCart || { products: [], totalPrice: 0 });
        }

        if (userCart) {
            guestCart.products.forEach((guestProduct) => {
                const productIndex = userCart.products.findIndex(
                    (item) =>
                        item.productId.toString() === guestProduct.productId.toString() &&
                        item.size === guestProduct.size &&
                        item.color === guestProduct.color
                );

                if (productIndex > -1) {
                    userCart.products[productIndex].quantity += guestProduct.quantity;
                } else {
                    userCart.products.push(guestProduct);
                }
            });

            userCart.totalPrice = userCart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await userCart.save();
            await Cart.deleteOne({ guestId: guestId });

            return res.status(200).json(userCart);
        } else {
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json(guestCart);
        }
    } catch (error) {
        console.error("Merge Cart Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;