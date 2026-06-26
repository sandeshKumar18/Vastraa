import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

// Action Imports
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { clearCart, clearCartError } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Store Selection
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);
  
  // Component Local State
  const [checkoutId, setCheckoutId] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("shipping"); // 'shipping' or 'payment'
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Clear stale cart errors on mount
  useEffect(() => {
    dispatch(clearCartError());
  }, [dispatch]);

  // Redirect if cart is empty
  useEffect(() => {
    if (paymentSuccess) return;
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate, paymentSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        setCheckoutStep("payment");
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    }
  };

  // Finalizes the database inventory mapping and sets flags
  const handleFinalizeCheckout = async (cId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${cId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Finalize error:", error);
    }
  };

  const handlePaymentSuccess = async (details) => {
    setIsProcessing(true);
    console.log("Full payment details:", details);

    try {
      // 1. Update checkout payment status record in DB
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // 2. Finalize order decrement mappings inside DB architecture
      if (checkoutId) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        console.error("Payment succeeded but checkout ID configuration context was missing.");
      }

      // 3. Assemble frontend representation mapping for tracking confirmation layout metrics
      const orderData = {
        paypalOrderId: details.id,
        payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        payerEmail: details.payer.email_address,
        status: details.status,
        products: cart.products,
        totalPrice: cart.totalPrice,
        shippingAddress: shippingAddress,
      };

      // Clear the cart on payment success
      setPaymentSuccess(true);
      dispatch(clearCart());

      navigate("/order-confirmation", { state: { order: orderData } });
    } catch (error) {
      console.error("Order processing processing structural runtime exception caught:", error);
      alert("Payment captured but could not sync order on server. Contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-10">Syncing active structures...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
        {/* --- LEFT SECTION --- */}
        <div>
          <h2 className="text-2xl uppercase mb-6 font-semibold">Checkout</h2>

          {checkoutStep === "shipping" ? (
            <form onSubmit={handleContinueToPayment}>
              <h3 className="text-lg mb-4 font-medium">Contact Details</h3>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || "guest@example.com"}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-500"
                  disabled
                />
              </div>

              <h3 className="text-lg mb-4 font-medium">Delivery</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingAddress.firstName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingAddress.lastName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-6"
                required
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded text-lg font-medium hover:bg-gray-800 transition"
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            <div>
              {/* Shipping Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold text-gray-700">Shipping To</h3>
                  <button
                    onClick={() => setCheckoutStep("shipping")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address}
                  <br />
                  {shippingAddress.city}, {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country} | {shippingAddress.phone}
                </p>
              </div>

              {/* Payment Section */}
              <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Pay with PayPal</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Complete your purchase securely using PayPal. Click a button below to proceed.
                </p>

                {isProcessing ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-600">Processing your order...</p>
                  </div>
                ) : (
                  <PayPalScriptProvider
                    options={{
                      "client-id": import.meta.env.VITE_PayPalClientId,
                      currency: "USD",
                    }}
                  >
                    <PayPalButton
                      amount={cart.totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={(err) => {
                        console.error("Payment processing error structural configuration catch point:", err);
                        alert("Payment failed. Please try again.");
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SECTION: Order Summary --- */}
        <div className="bg-gray-50 p-6 rounded-lg self-start">
          <h2 className="text-xl font-medium mb-6">Order Summary</h2>
          <div className="border-b mb-6 max-h-[400px] overflow-y-auto">
            {cart?.products?.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between py-4 border-b last:border-none"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">${item.price}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-4">
            <span>Total</span>
            <span>${cart?.totalPrice}</span>
          </div>
        </div>
      </div>
  );
};

export default Checkout;