# 👗 Vastraa – Modern Fashion E-Commerce Platform

Vastraa is a full-stack MERN-based fashion e-commerce platform designed to provide a seamless online shopping experience. The application features secure authentication, product browsing, cart management, order processing, PayPal payment integration, and a comprehensive admin dashboard for managing products, users, and orders.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login
* JWT Authentication & Authorization
* Browse Products by Category
* Product Details Page
* Product Search & Filtering
* Add to Cart
* Checkout System
* PayPal Payment Integration
* Order Confirmation
* Order History Tracking
* User Profile Management

### 🛠️ Admin Features

* Admin Dashboard
* Product Management (Create, Update, Delete)
* Order Management
* User Management
* Product Image Uploads
* Inventory Control

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router DOM
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (File Uploads)

### Payment Gateway

* PayPal REST API

---

## 📂 Project Structure

```text
Vastraa/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Checkout.js
│   │   └── Subscriber.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── checkoutRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── adminOrderRoutes.js
│   │   ├── productAdminRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── subscriberRoutes.js
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── uploads/
│   ├── seeder.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Cart/
│   │   │   ├── Common/
│   │   │   ├── Layout/
│   │   │   └── Product/
│   │   │
│   │   ├── pages/
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sandeshKumar18/Vastraa---Modern-Fashion.git

cd Vastraa---Modern-Fashion
```

---

### 2️⃣ Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
```

Run the backend server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

---

## 🔐 Environment Variables

### Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
PAYPAL_CLIENT_ID=
```

### Frontend

```env
VITE_BACKEND_URL=
```

---

## 💳 Payment Integration

Vastraa integrates PayPal Checkout to provide a secure and reliable payment experience.

Features include:

* Secure Payment Processing
* Payment Verification
* Order Confirmation After Successful Transactions

---

## 🔒 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication.

### User Access

* Register
* Login
* Manage Profile
* Place Orders
* View Order History

### Admin Access

* Manage Products
* Manage Users
* Manage Orders
* Upload Product Images

---

## 📸 Screenshots

Add screenshots here after deployment.

Suggested screenshots:

* Home Page
* Product Listing
* Product Details
* Shopping Cart
* Checkout Page
* PayPal Payment
* Admin Dashboard
* Order Management

---

## 🌟 Future Enhancements

* Product Reviews & Ratings
* Wishlist Functionality
* Coupon & Discount System
* Order Tracking
* Email Notifications
* Advanced Analytics Dashboard
* AI-Powered Product Recommendations

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Sandesh Kumar

GitHub: https://github.com/sandeshKumar18

If you found this project useful, consider giving it a ⭐ on GitHub.
