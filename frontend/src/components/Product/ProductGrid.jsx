import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center">Error loading products.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="group block">
          <div className="bg-white p-4 rounded-xl border border-transparent hover:border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg relative">
              <img 
                src={product.images[0].url} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Quick View
                </span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-800 group-hover:text-black transition-colors duration-200">{product.name}</h3>
            <p className="text-gray-500 font-semibold mt-1">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;