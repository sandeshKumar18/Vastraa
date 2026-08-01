import React from 'react';
import { Link } from 'react-router-dom';
import { TbBrandMeta } from 'react-icons/tb';
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';
import { FaLink, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t py-12">
     <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0"> 

           {/* Newsletter Section */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <p className="text-gray-500 mb-4 font-medium">Sign up and get 10% off your first order.</p>
          
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button 
              type="submit" 
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

               {/* Shop Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/collection/all?gender=Men"  className="hover:text-gray-500 transition-colors">Men's Top Wear</Link></li>
            <li><Link to="/collection/all?gender=Women" className="hover:text-gray-500 transition-colors">Women's Top Wear</Link></li>
            <li><Link to="/collection/all?category=Bottom Wear" className="hover:text-gray-500 transition-colors">Men's Bottom Wear</Link></li>
            <li><Link to="/collection/all?category=Bottom Wear" className="hover:text-gray-500 transition-colors">Women's Bottom Wear</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">About Us</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Features</Link></li>
          </ul>
        </div>

          {/* Follow Us & Contact */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 text-gray-800">
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 text-gray-800">
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 text-gray-800">
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          
          <p className="text-gray-500 text-sm mb-2">Call Us</p>
          <p className="flex items-center text-gray-800 font-medium">
            <FiPhoneCall className="inline-block mr-2" />
            +91 9528480643
          </p>
        </div>
        </div>
      
      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © 2026, Vastraa. All Rights Reserved.
          <br></br>
          Designed by <a href="https://www.linkedin.com/in/sandesh-kumar-1a3628328/" className="text-gray-800 hover:text-gray-500 transition-colors">  Sandesh Kumar <FaLinkedin className="inline-block mr-1" /></a>
        </p>
      </div>


           </footer>
  );
};

export default Footer;