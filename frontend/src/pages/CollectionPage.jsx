import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Product/FilterSidebar";
import SortOptions from "../components/Product/SortOptions";
import ProductGrid from "../components/Product/ProductGrid";
import { useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  
  const queryParam = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParam }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden flex items-center justify-center p-2 border-b"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white overflow-y-auto transition-transform transform lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl uppercase font-bold">
            {collection ? `${collection} Collection` : "All Collection"}
          </h2>
          <SortOptions />
        </div>

        {/* Pass the products state to the Grid component */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;