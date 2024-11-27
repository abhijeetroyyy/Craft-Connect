"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsTruck, BsShieldCheck } from "react-icons/bs";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ProductOverview = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        if (!data || !data.title || !data.image || !data.price) {
          throw new Error("Product data is incomplete");
        }

        setProduct(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError(true);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!product) return;

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_1WEsbofwCAiJAg",
      amount: product.price * 100,
      currency: "INR",
      name: "My E-Commerce Store",
      description: product.title,
      image: product.image,
      handler: (response) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Abhijeet Roy",
        email: "abhijeet@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      alert(`Payment failed. Error: ${response.error.description}`);
    });

    rzp.open();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">
          Error loading product. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#121212] min-h-screen transition-all">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm mb-6">
          <span className="text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
            >
              Home
            </Link>{" "}
            &gt;{" "}
            <Link
              href="/products"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
            >
              Products
            </Link>{" "}
            &gt;{" "}
            <span className="text-gray-800 dark:text-gray-300 font-medium">
              {product.title}
            </span>
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image Section */}
          <section className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="border rounded-xl overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105">
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                className="object-contain"
                placeholder="blur"
                blurDataURL={product.image}
              />
            </div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={index}
                  src={product.image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="border rounded-lg hover:shadow-lg transition-transform duration-200 transform hover:scale-110 cursor-pointer"
                  placeholder="blur"
                  blurDataURL={product.image}
                />
              ))}
            </div>
          </section>

          {/* Product Details Section */}
          <section className="w-full lg:w-2/3">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) =>
                  i < Math.round(product.rating.rate) ? (
                    <AiFillStar key={i} />
                  ) : (
                    <AiOutlineStar key={i} />
                  )
                )}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.rating.count} ratings)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ₹{product.price}
              </p>
              <p className="line-through text-gray-500">₹{(product.price * 1.5).toFixed(2)}</p>
              <span className="text-green-600 font-medium">(33% OFF)</span>
            </div>

            {/* Highlights */}
            <div className="mt-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Highlights
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>High-quality material</li>
                <li>One-year warranty</li>
                <li>Fast delivery options</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
              >
                Buy Now
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
