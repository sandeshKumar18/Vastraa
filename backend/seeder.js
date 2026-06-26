const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User'); 
const products = require('./data/products');
const Cart = require('./models/Cart');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        // delete existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        await Cart.deleteMany({});

        // 2. create an admin user
        const createdUser = await User.create({
            name: "Sandesh Kumar",
            email: "sandeshbaghel7@gmail.com",
            password: "@sandesh28",
            role: "admin",
        });

        const userID = createdUser._id;

       // connect products to the admin user
        const sampleProducts = products.map((product) => {
            return { ...product, user: userID };
        });

        // enter sample products into the database
        await Product.insertMany(sampleProducts);

        console.log("Data Seeded Successfully!");
        process.exit(); 
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1); 
    }
};

// run the seeding function
seedData();