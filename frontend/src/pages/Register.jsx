import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import registerImg from "../assets/register.webp"; // Using a unique image for register
import { registerUser } from "../redux/slices/authSlice"; 
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId} = useSelector((state) => state.auth);
  const {cart} = useSelector((state) => state.cart);

  let redirect = new URLSearchParams(location.search).get("redirect") || "/";
  if (redirect.startsWith("http://localhost:5173")) {
    redirect = redirect.replace("http://localhost:5173", "");
  }

  useEffect(() => {
    if (user) {
      if (cart?.products?.length > 0 && guestId) {
        // Merge guest cart with user cart
        dispatch(mergeCart({ guestId }))
          .then(() => {
            navigate(redirect);
          })
          .catch(() => {
            navigate(redirect);
          });
      } else {
        navigate(redirect);
      }
    }
  }, [user, guestId, cart, dispatch, redirect, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
    toast.success("Account created successfully!");
    console.log("Register Info:", { name, email, password });
  };

  return (
    <div className="flex">
      {/* LEFT SIDE: Register Form Container */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Velora</h2>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your details to create an account.
          </p>

          {/* Name field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your Name"
              required
            />
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* RIGHT SIDE: Image Container */}
     <div className="hidden md:block w-1/2 bg-gray-800">
             <div className="h-full flex flex-col justify-center items-center">
               <img
                 src={registerImg}
                 alt="Register to Account"
                 className="h-[750px] w-full object-cover"
               />
             </div>
           </div>
    </div>
  );
};

export default Register;