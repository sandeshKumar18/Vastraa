import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";



const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    if (!user) {
      dispatch(addToCart({
        productId: productFetchId,
        size: selectedSize,
        color: selectedColor,
        quantity,
        userId: null,
        guestId,
      })).then(() => {
        toast.success("Product added to cart! Redirecting to login...", { duration: 1500 });
        setIsButtonDisabled(false);
        navigate("/login?redirect=/checkout");
      }).catch(() => {
        toast.error("Failed to add product to cart.", { duration: 1000 });
        setIsButtonDisabled(false);
      });
    } else {
      dispatch(addToCart({
        productId: productFetchId,
        size: selectedSize,
        color: selectedColor,
        quantity,
        userId: user?.id || user?._id,
        guestId,
      })).then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
        setIsButtonDisabled(false);
      }).catch(() => {
        toast.error("Failed to add product to cart.", { duration: 1000 });
        setIsButtonDisabled(false);
      });
    }
  };

  if (loading) {
    return <p className="text-center">Loading product details...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error loading product details.</p>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          {/* Main Product Info */}
          <div className="flex flex-col md:flex-row">
            {/* LEFT: THUMBNAILS */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url || null}
                  alt={image.altText || "Thumbnail"}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-200"}`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* MIDDLE: MAIN IMAGE */}
            <div className="md:w-1/2 mb-4">
              <div className="mb-4">
                <img src={mainImage || null} alt="Main Product" className="w-full h-auto object-cover rounded-lg" />
              </div>
              <div className="md:hidden flex space-x-4 mb-4">
                {selectedProduct.images.map((image, index) => (
                  <img key={index} src={image.url || null} alt="Mobile Thumbnail" className="w-20 h-20 object-cover rounded-lg border" onClick={() => setMainImage(image.url)} />
                ))}
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
              <div className="mb-4">
                <p className="text-gray-400 line-through text-lg">{selectedProduct.originalPrice}</p>
                <p className="text-2xl font-bold text-gray-900">$ {selectedProduct.price}</p>
              </div>
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

              {/* Colors */}
              <div className="mb-6">
                <p className="font-semibold mb-2">
                  Color: {selectedColor && <span className="font-normal text-gray-600 ml-1">{selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.colors.map((color) => {
                    const colorMap = {
                      red: "#e53e3e",
                      blue: "#3182ce",
                      yellow: "#d69e2e",
                      black: "#1a202c",
                      white: "#f7fafc",
                      gray: "#718096",
                      grey: "#718096",
                      navy: "#1a365d",
                      "navy blue": "#1a365d",
                      "dark blue": "#2a4365",
                      "light blue": "#63b3ed",
                      burgundy: "#702459",
                      "tropical print": "#38a169",
                      "navy palms": "#2c5282",
                      "dark wash": "#2d3748",
                      "heather gray": "#a0aec0",
                      olive: "#6b7b2e",
                      charcoal: "#4a5568",
                      "dark green": "#276749",
                      pink: "#ed64a6",
                      beige: "#e8d5b7",
                      khaki: "#c3a35d",
                      brown: "#92400e",
                      "light wash": "#bee3f8",
                      orange: "#ed8936",
                      purple: "#805ad5",
                      green: "#38a169",
                      lavender: "#b794f4",
                      "light blue": "#63b3ed",
                    };
                    const hex = colorMap[color.toLowerCase()] || "#a0aec0";
                    const isSelected = selectedColor === color;
                    const isWhiteish = ["white", "beige", "light wash"].includes(color.toLowerCase()) || hex === "#f7fafc" || hex === "#e8d5b7" || hex === "#bee3f8";
                    return (
                      <button
                        key={color}
                        title={color}
                        onClick={() => setSelectedColor(color)}
                        className="relative flex items-center justify-center"
                        style={{ width: 36, height: 36 }}
                      >
                        {/* Outer ring when selected */}
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: isSelected ? "2px solid #3182ce" : "2px solid transparent",
                            transition: "border-color 0.15s",
                          }}
                        />
                        {/* Color swatch */}
                        <span
                          style={{
                            display: "block",
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            backgroundColor: hex,
                            border: isWhiteish ? "1px solid #cbd5e0" : "1px solid rgba(0,0,0,0.1)",
                            boxShadow: isSelected ? "0 0 0 1px #fff inset" : "none",
                          }}
                        />
                        {/* Checkmark when selected */}
                        {isSelected && (
                          <span
                            style={{
                              position: "absolute",
                              color: isWhiteish ? "#2d3748" : "#fff",
                              fontSize: 13,
                              fontWeight: "bold",
                              lineHeight: 1,
                              textShadow: isWhiteish ? "none" : "0 1px 2px rgba(0,0,0,0.4)",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Size:</p>
                <div className="flex space-x-2">
                  {selectedProduct.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 border rounded-md ${selectedSize === size ? "bg-black text-white" : "bg-white text-black"}`}>{size}</button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-semibold mb-2">Quantity:</p>
                <div className="flex items-center space-x-4 border w-fit rounded-md px-2 py-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl px-2">-</button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-xl px-2">+</button>
                </div>
              </div>

              <button onClick={handleAddToCart} disabled={isButtonDisabled} className={`w-full bg-black text-white py-3 rounded-md font-bold uppercase hover:bg-gray-800 transition mb-10 ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>

              {/* Characteristics Table */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm">
                  <tbody>
                    <tr><td className="py-1 text-gray-500">Brand</td><td className="py-1">{selectedProduct.brand}</td></tr>
                    <tr><td className="py-1 text-gray-500">Material</td><td className="py-1">{selectedProduct.material}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-bold mb-10">You May Also Like</h2>
            <ProductGrid products={similarProducts} loading={false} error={null} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;