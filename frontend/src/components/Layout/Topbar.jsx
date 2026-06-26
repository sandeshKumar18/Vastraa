import React from 'react';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-gradient-to-r from-[#8b3520] via-[#a64227] to-[#8b3520] text-white">
      <div className="container mx-auto grid grid-cols-3 items-center py-4 px-4">
        
        {/* Social Media Icons - Hidden on small screens, flex on medium+ */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* Center Text Message */}
        <div className="text-sm text-center col-span-3 md:col-span-1">
          <span>We ship worldwide — Fast and reliable shipping!</span>
        </div>

        {/* Phone Number - Hidden on small screens, block on medium+ */}
        <div className="text-sm hidden md:block text-right">
          <a href="tel:+91 9528480643" className="hover:text-gray-300">
            +91 9528480643
          </a>
        </div>

      </div>
    </div>
  );
};

export default Topbar;