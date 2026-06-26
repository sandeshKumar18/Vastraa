import React from 'react';
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import CartContests from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isCartOpen, toggleCartDrawer }) => {

     const navigate = useNavigate();
     const {user,guestId} = useSelector((state) => state.auth);
     const {cart} = useSelector((state) => state.cart);
     const userId = user ? (user.id || user._id) : null; // Use guestId if user is not logged in
      const handleCheckout = () => {
       
        if(!user){
          navigate("/login?redirect=/checkout");
        }else{
          navigate("/checkout");
        }
      };

  return (
    <>
      {/* Cart Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 h-full bg-white shadow-xl z-[110] transition-transform duration-300 transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        
        {/* 1. Close Button Header */}
        <div className="flex justify-end p-4">
          <button onClick={toggleCartDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* 2. Cart contents with scrollable area */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cart && cart?.products?.length > 0 ? (<CartContests cart={cart} userId={userId} guestId={guestId} />) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* 3. Checkout button fixed at the bottom */}
        <div className="p-4 bg-white sticky bottom-0 border-t">
          {cart && cart?.products?.length > 0 && (
            <button onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Checkout
            </button>
          )}
          <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
            Shipping, taxes, and discount codes calculated at checkout.
          </p>
        </div>

      </div>
    </>
  );
};

export default CartDrawer;