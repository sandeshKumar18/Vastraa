const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    sizes: {
        type: [String],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    collections: {
        type: [String],
        required: true,
    },
    material: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        required: true,
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            altText: {
                type: String,
            },
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Meta Data for SEO
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    metaKeywords: {
        type: String,
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: { type: String, default: 'cm' }
    }
}, {
    timestamps: true, // CreatedAt සහ UpdatedAt ස්වයංක්‍රීයව එක් කරයි
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;