import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Product/GenderCollectionSection'
import NewArrivals from '../components/Product/NewArrivals'
import ProductDetails from '../components/Product/ProductDetails'
import ProductGrid from '../components/Product/ProductGrid'
import FeaturedCollection from '../components/Product/FeaturedCollection'
import FeaturesSection from '../components/Product/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice'
import axios from 'axios'



function Home() {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const [bestSellers, setBestSellers] = useState([]);
  const bestSellerProduct = bestSellers[0] || null;

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellers(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className='text-center text-gray-500'>No best sellers available at the moment.</p>
      )}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>Top wear for Women</h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />

    </div>
  )
}

export default Home