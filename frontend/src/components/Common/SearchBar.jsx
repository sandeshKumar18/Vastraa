import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setFilters, fetchProductsByFilters } from '../../redux/slices/productSlice';

const Search = ({ isTransparent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm(""); // Clear search when closing
  };

  const handleSearch=(e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate("/collection/all?search=" + searchTerm);
    setIsOpen(false)
    handleSearchToggle();
  }

  return (
    <div className="flex items-center">
      {isOpen ? (
        
        /* Full width Search Overlay */
        <div className="absolute top-0 left-0 w-full bg-white h-24 flex items-center justify-center z-50 px-4">
          <form className="relative w-full max-w-4xl flex items-center justify-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 px-4 py-2 pl-4 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              />
              
              {/* Search Icon inside input */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <HiMagnifyingGlass className="h-6 w-6" />
              </button>
            </div>

            {/* Close Button on the far right */}
            <button
              type="button"
              onClick={handleSearchToggle}
              className="ml-4 text-gray-600 hover:text-gray-800"
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </form>
        </div>
      ) : (
        /* Normal Search Icon */
        <button onClick={handleSearchToggle} className={isTransparent ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-black"}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Search;
