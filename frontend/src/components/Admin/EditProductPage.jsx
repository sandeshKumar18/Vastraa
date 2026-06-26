import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../redux/slices/productSlice";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: [],
    material: "",
    gender: "Unisex",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product detail in edit mode
  useEffect(() => {
    if (isEditMode) {
      const getProductDetails = async () => {
        try {
          const actionResult = await dispatch(fetchProductDetails(id)).unwrap();
          setProductData({
            name: actionResult.name || "",
            description: actionResult.description || "",
            price: actionResult.price || 0,
            discountPrice: actionResult.discountPrice || 0,
            countInStock: actionResult.countInStock || 0,
            sku: actionResult.sku || "",
            category: actionResult.category || "",
            brand: actionResult.brand || "",
            sizes: actionResult.sizes || [],
            colors: actionResult.colors || [],
            collections: actionResult.collections || [],
            material: actionResult.material || "",
            gender: actionResult.gender || "Unisex",
            images: actionResult.images || [],
          });
        } catch (error) {
          toast.error("Failed to fetch product details.");
        }
      };
      getProductDetails();
    }
  }, [dispatch, id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: response.data.imageUrl, altText: file.name }],
      }));
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData })).unwrap();
        toast.success("Product updated successfully.");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully.");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to save product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white">
      <h2 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Product" : "Create Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            rows="4"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          ></textarea>
        </div>

        {/* Price & Discount Price */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Stock & SKU */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Gender & Material */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2">Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Material</label>
            <input
              type="text"
              name="material"
              value={productData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Sizes (Comma Separated) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g. S, M, L, XL"
          />
        </div>

        {/* Colors (Comma Separated) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Colors (comma-separated)</label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g. Red, Blue, Black"
          />
        </div>

        {/* Collections (Comma Separated) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collections (comma-separated)</label>
          <input
            type="text"
            name="collections"
            value={productData.collections.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                collections: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g. Spring, Summer, Winter"
          />
        </div>

        {/* Image Upload & Preview */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              uploading
                ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
              accept="image/*"
            />
          </label>
          {uploading && (
            <div className="flex items-center gap-2 mt-2">
              <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="text-sm text-gray-500">Uploading image...</p>
            </div>
          )}
          <div className="flex gap-4 mt-4 overflow-x-auto py-2">
            {productData.images && productData.images.map((image, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() =>
                    setProductData({
                      ...productData,
                      images: productData.images.filter((_, imgIdx) => imgIdx !== index),
                    })
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors font-bold text-lg"
        >
          {isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;