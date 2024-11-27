import React, { useEffect, useState } from 'react';

const PaymentPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment process
  const handlePayment = async () => {
    if (!selectedProduct) {
      alert('Please select a product to buy.');
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    const options = {
      key: 'rzp_test_1WEsbofwCAiJAg', // Replace with your Razorpay API key
      amount: selectedProduct.price * 100, // Amount in paise
      currency: 'INR',
      name: 'Fake Store',
      description: selectedProduct.title,
      handler: (response) => {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9876543210',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border p-4 rounded shadow ${
              selectedProduct?.id === product.id ? 'border-blue-500' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedProduct(product)}
          >
            <h2 className="font-semibold">{product.title}</h2>
            <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handlePayment}
        className={`mt-6 w-full py-2 px-4 text-white font-bold rounded ${
          selectedProduct
            ? 'bg-blue-500 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!selectedProduct}
      >
        {selectedProduct ? `Buy Now: ₹${selectedProduct.price.toFixed(2)}` : 'Select a Product'}
      </button>
    </div>
  );
};

export default PaymentPage;
