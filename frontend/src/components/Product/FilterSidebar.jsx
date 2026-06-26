import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women"];
  const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle"];

  useEffect(() => {
    const min = searchParams.get("minPrice") || 0;
    const max = searchParams.get("maxPrice") || 100;
    setPriceRange([Number(min), Number(max)]);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const handleCheckboxChange = (key, value, isChecked) => {
    const params = new URLSearchParams(searchParams);
    let currentValues = params.get(key) ? params.get(key).split(",") : [];

    if (isChecked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      currentValues = currentValues.filter((val) => val !== value);
    }

    if (currentValues.length > 0) {
      params.set(key, currentValues.join(","));
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handlePriceChange = (e) => {
    const newMaxPrice = e.target.value;
    setPriceRange([0, newMaxPrice]);
    const params = new URLSearchParams(searchParams);
    params.set("minPrice", 0);
    params.set("maxPrice", newMaxPrice);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-800">Filter</h3>
        <button 
          onClick={clearAllFilters}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((cat) => (
          <div key={cat} className="flex items-center mb-1">
            <input 
              type="radio" 
              name="category" 
              value={cat} 
              checked={searchParams.get("category") === cat}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="mr-2 h-4 w-4 text-blue-500" 
            />
            <span className="text-gray-700">{cat}</span>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gen) => (
          <div key={gen} className="flex items-center mb-1">
            <input 
              type="radio" 
              name="gender" 
              value={gen} 
              checked={searchParams.get("gender") === gen}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="mr-2 h-4 w-4 text-blue-500" 
            />
            <span className="text-gray-700">{gen}</span>
          </div>
        ))}
      </div>

      {/* Color Swatches */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isSelected = searchParams.get("color") === color;
            return (
              <button
                key={color}
                onClick={() => handleFilterChange("color", isSelected ? "" : color)}
                className={`w-6 h-6 rounded-full border ${
                  isSelected ? "ring-2 ring-black ring-offset-2" : "border-gray-300"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            );
          })}
        </div>
      </div>

      {/* Size Checkboxes */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input 
              type="checkbox" 
              className="mr-2" 
              value={size}
              checked={searchParams.get("size")?.split(",").includes(size) || false}
              onChange={(e) => handleCheckboxChange("size", size, e.target.checked)}
            />
            <span className="text-gray-700 text-sm">{size}</span>
          </div>
        ))}
      </div>

      {/* Material Checkboxes */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-500"
              value={material}
              checked={searchParams.get("material")?.split(",").includes(material) || false}
              onChange={(e) => handleCheckboxChange("material", material, e.target.checked)}
            />
            <span className="text-gray-700 text-sm">{material}</span>
          </div>
        ))}
      </div>

      {/* Brand Checkboxes */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 text-blue-500"
              value={brand}
              checked={searchParams.get("brand")?.split(",").includes(brand) || false}
              onChange={(e) => handleCheckboxChange("brand", brand, e.target.checked)}
            />
            <span className="text-gray-700 text-sm">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Price Range</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
        />
        <div className="flex justify-between text-gray-600 text-sm mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;