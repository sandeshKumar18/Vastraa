import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from 'react-icons/hi2';
import { IoMdClose } from "react-icons/io"; // Import Close Icon
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';

function Navbar() {
  // States for both drawers
  const [drawerOpen, setDrawerOpen] = useState(false); // Cart
  const [navDrawerOpen, setNavDrawerOpen] = useState(false); // Mobile Menu
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);

  const {cart} = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount = cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isTransparent = location.pathname === "/" && !isScrolled;
  const linkColorClass = isTransparent
    ? "text-white/80 hover:text-white"
    : "text-gray-700 hover:text-black";

  return (
    <>
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isTransparent ? "bg-transparent border-b-0 text-white" : "bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)]"}`}>
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Left-Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Vastraa</Link>
        </div>

        {/* Center-NavbarLinks (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/collection/all?gender=Men" className={`${linkColorClass} text-sm font-medium uppercase`}>Men</Link>
          <Link to="/collection/all?gender=Women" className={`${linkColorClass} text-sm font-medium uppercase`}>Women</Link>
          <Link to="/collection/all?category=Top Wear" className={`${linkColorClass} text-sm font-medium uppercase`}>Top Wear</Link>
          <Link to="/collection/all?category=Bottom Wear" className={`${linkColorClass} text-sm font-medium uppercase`}>Bottom Wear</Link>
        </div>

        {/* Right-icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === 'admin' && (
            <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">Admin</Link>
          )}
          <Link to="/profile" className={isTransparent ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-black"}>
            <HiOutlineUser className="h-6 w-6" />
          </Link>

          <button onClick={toggleDrawer} className={`relative ${isTransparent ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-black"}`}>
            <HiOutlineShoppingBag className="h-6 w-6" />
            <span className="absolute -top-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{cartItemCount}</span>
          </button>

          <div className='overflow-hidden'>
            <SearchBar isTransparent={isTransparent} />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button onClick={toggleNavDrawer} className={`md:hidden ${isTransparent ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-black"}`}>
            <HiBars3BottomRight className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* --- Mobile Nav Drawer (Left Side) --- */}
      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 z-[110] ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Close Button Area */}
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link to="/collection/all?gender=Men" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Men</Link>
            <Link to="/collection/all?gender=Women" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Women</Link>
            <Link to="/collection/all?category=Top Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Top Wear</Link>
            <Link to="/collection/all?category=Bottom Wear" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Bottom Wear</Link>
          </nav>
        </div>
      </div>
    </header>

     

      {/* Cart Drawer Component */}
      <CartDrawer isCartOpen={drawerOpen} toggleCartDrawer={toggleDrawer} /> 
    </>
  );
}

export default Navbar;