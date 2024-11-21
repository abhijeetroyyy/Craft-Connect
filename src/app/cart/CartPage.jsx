"use client";

import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shippingCost = 5; // Flat shipping cost

  // Fetch cart data from Fake Store API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/carts/2");
        const data = await response.json();

        // Example transformation logic: Map cart products with quantities
        const cartItems = data.products.map((product) => ({
          id: product.productId,
          title: `Product ${product.productId}`, // Placeholder title
          image: "https://via.placeholder.com/150", // Placeholder image
          price: 20, // Placeholder price
          quantity: product.quantity,
        }));

        setCart(cartItems);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch cart data.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Calculate subtotal and total price
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = subtotal + shippingCost;

  // Handlers for cart actions
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Loading your cart...</div>
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-600 rounded-full"></div>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return <p className="text-red-500 text-lg text-center">{error}</p>;
  }

  return (
    <div className="bg-white dark:bg-[#212121] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Shopping Cart
        </h1>

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner />
        ) : cart.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-3 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-24 h-24 object-contain rounded-md border border-gray-300 dark:border-gray-700 mb-4 sm:mb-0"
                  />

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 sm:ml-6 text-center sm:text-left">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Price: <span className="font-semibold">${item.price}</span>
                    </p>
                    <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3">
                      <span className="text-gray-600 dark:text-gray-300">Qty:</span>

                      {/* Quantity Input */}
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                        className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-200 text-center"
                      />

                      {/* Total Price for Item */}
                      <span className="font-semibold text-gray-800 dark:text-white">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 sm:mt-0 sm:ml-auto text-red-500 hover:text-red-700 font-medium text-sm transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary Section */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white border-t pt-4 mt-4">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg mt-6 text-sm font-semibold hover:bg-blue-600 transition duration-200">
                Proceed to Checkout
              </button>

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full bg-red-500 text-white py-3 rounded-lg mt-4 text-sm font-semibold hover:bg-red-600 transition duration-200"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
