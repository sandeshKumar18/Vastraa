import React from 'react';
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {

  const dispatch = useDispatch();

  const handleAddToCart = (productId,delta,quantity,size,color) => {  
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    dispatch(updateCartItem({ userId, guestId, productId, quantity: newQuantity, size, color }));
  };

  const handleRemoveFromCart = (productId,size,color) => {
    dispatch(removeFromCart({ userId, guestId, productId, size, color }));
  };

  const cartProducts = cart?.products || [];

  
 

  return (
    <div>
      {cartProducts.map((product, index) => (
        <div key={index} className="flex items-start justify-between py-4 border-b">
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color}
              </p>
              
              {/* Quantity Controller */}
              <div className="flex items-center mt-2 border rounded-md w-fit">
                <button onClick={()=>handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)} className="px-2 py-1 text-xl border-r hover:bg-gray-100" >-</button>
                <span className="px-4">{product.quantity}</span>
                <button onClick={()=>handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)} className="px-2 py-1 text-xl border-l hover:bg-gray-100">+</button>
              </div>
            </div>
          </div>

          {/* Right Side: Price and Delete */}
          <div className="flex flex-col items-end justify-between h-24">
            <p className="font-semibold">$ {product.price}</p>
            <button onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)} className="text-red-500 hover:text-red-700">
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;