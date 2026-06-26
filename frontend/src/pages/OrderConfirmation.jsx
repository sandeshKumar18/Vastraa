import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <p className="text-gray-600 mb-6">
          It looks like you haven't placed an order yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-2">
        Thank You for Your Order!
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Your payment has been processed successfully.
      </p>

      {/* Order Details Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Order Details
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-medium">{order.paypalOrderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payer:</span>
            <span className="font-medium">{order.payerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="font-medium">{order.payerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium text-green-600">{order.status}</span>
          </div>
        </div>

        {/* Ordered Items */}
        <h4 className="text-md font-semibold mt-6 mb-3 border-t pt-4">
          Items Ordered
        </h4>
        <div className="space-y-3">
          {order.products.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </p>
              </div>
              <p className="font-semibold">${item.price}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold mt-6 pt-4 border-t">
          <span>Total Paid</span>
          <span>${order.totalPrice}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>

      <Link
        to="/"
        className="block w-full bg-black text-white py-3 rounded text-center text-lg font-medium hover:bg-gray-800 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
