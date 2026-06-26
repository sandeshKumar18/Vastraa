import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const{ orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10">Error: {error}</p>;
  if (!orderDetails) return <p className="p-10">Order not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      <div className="p-4 sm:p-6 rounded-lg border bg-white shadow-sm">
        {/* Order Info Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Order ID: #{orderDetails._id}</h3>
            <p className="text-gray-500">{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:text-right">
            <span className={`${
              orderDetails.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            } px-3 py-1 rounded-full text-sm font-medium w-fit sm:ml-auto`}>
              {orderDetails.isPaid ? "Paid" : "Unpaid"}
            </span>
            <span className={`${
              orderDetails.status === "delivered" ? "bg-green-100 text-green-800" :
              orderDetails.status === "shipped" ? "bg-blue-100 text-blue-800" :
              orderDetails.status === "processing" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            } px-3 py-1 rounded-full text-sm font-medium w-fit sm:ml-auto capitalize`}>
              {orderDetails.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b pb-8">
          <div>
            <h4 className="font-bold mb-2">Payment Info</h4>
            <p className="text-gray-600">Method: {orderDetails.paymentMethod}</p>
            <p className="text-gray-600">Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Shipping Info</h4>
            <p className="text-gray-600">Address: {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems.map((item) => (
                <tr key={item.productId || item._id} className="border-b">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <Link to={`/product/${item.productId || item._id}`} className="text-blue-500 hover:underline">{item.name}</Link>
                  </td>
                  <td className="py-4 px-4">${item.price}</td>
                  <td className="py-4 px-4 text-center">{item.quantity}</td>
                  <td className="py-4 px-4">${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link to="/my-orders" className="text-blue-500 hover:underline text-sm font-medium">
            &larr; Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;