const express = require('express');
const Product = require('../models/Product');
const { protect,admin } = require('../middleware/authMiddleware');

const router = express.Router();


// @route POST /api/products
// @desc Create a new product
// @access Private (Admin only)

router.post('/', protect,admin, async (req, res) => { 
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
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @ROUTE PUT /api/products/:id
// @DESC Update a product
// @ACCESS Private (Admin only)
router.put('/:id', protect,admin, async (req, res) => {
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
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @ROUTE DELETE /api/products/:id
// @DESC Delete a product
// @ACCESS Private (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Use deleteOne() instead of remove()
        await product.deleteOne(); 
        res.json({ message: "Product removed" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    let sort = {};

    // --- Filter Logic ---

    // Collection Filter
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    // Category Filter
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    // Material Filter (Comma separated)
    if (material) {
      query.material = { $in: material.split(",") };
    }

    // Brand Filter
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    // Size Filter
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    // Color Filter
    if (color) {
      query.colors = { $in: [color] };
    }

    // Gender Filter
    if (gender) {
      query.gender = gender;
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search Logic (Name or Description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // --- Sort Logic ---
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          sort = { createdAt: -1 }; // Newest first
      }
    }

    // --- Fetch Products ---
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation date
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    // Fetch latest 8 products using sort and limit
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) 
      .limit(8);              

    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// @route GET /api/products/best-seller
// @desc Retrieve top-selling / highest-rated products
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find()
      .sort({ rating: -1, numReviews: -1 })
      .limit(4);

    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/similar/:id
// @desc Get similar products based on gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;

  try {
   
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   
    const similarProducts = await Product.find({
      _id: { $ne: id }, 
      gender: product.gender,
      category: product.category,
    }).limit(4); 

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);  
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



module.exports = router;