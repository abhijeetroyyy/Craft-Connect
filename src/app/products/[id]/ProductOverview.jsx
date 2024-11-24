"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsTruck, BsShieldCheck } from "react-icons/bs";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

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

        // Validate important fields before setting the product
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

  if (isLoading) {
    return (
      <div className="text-center py-6 text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-6 text-xl font-semibold text-red-500">
        Error loading product. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#212121] min-h-screen transition-all">
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb Navigation */}
        <nav
          className="text-sm text-gray-500 dark:text-gray-400 mb-4"
          aria-label="breadcrumb"
        >
          <span>
            <Link
              href="/"
              className="hover:text-blue-600 transition duration-300"
            >
              Home
            </Link>{" "}
            &gt;{" "}
            <Link
              href="/products"
              className="hover:text-blue-600 transition duration-300"
            >
              Products
            </Link>{" "}
            &gt;{" "}
            <span className="text-gray-800 dark:text-gray-200">
              {product.title}
            </span>
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Section */}
          <section className="w-full md:w-1/3 top-4 flex flex-col items-center">
            <div className="border rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 duration-300">
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                className="w-full object-contain"
                placeholder="blur"
                blurDataURL={product.image}
              />
            </div>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={index}
                  src={product.image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 border rounded-lg cursor-pointer transition-transform transform hover:scale-110"
                  placeholder="blur"
                  blurDataURL={product.image}
                />
              ))}
            </div>
          </section>

          {/* Product Details Section */}
          <section className="w-full md:w-2/3">
            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200">
              {product.title}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mt-2">
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

            {/* Price Section */}
            <div className="flex items-center mt-4">
              <p className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                ₹{product.price}
              </p>
              <p className="text-gray-500 dark:text-gray-400 line-through ml-4">
                ₹{(product.price * 1.5).toFixed(2)}
              </p>
              <p className="text-green-600 font-semibold ml-2">(33% OFF)</p>
            </div>

            {/* Offers */}
            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-600 p-4 rounded mt-4 shadow-lg">
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                Special Offers:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 mt-2 list-disc ml-6">
                <li>Get 10% cashback on select cards.</li>
                <li>Free shipping on orders over ₹500.</li>
                <li>Buy 2, get 1 free offer available.</li>
              </ul>
            </div>

            {/* Availability */}
            <div className="mt-4 flex items-center gap-4">
              <BsTruck className="text-green-600 text-lg" />
              <p className="text-green-600 font-medium">In Stock</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Specifications:
              </h2>
              <ul className="list-disc ml-6 text-gray-600 dark:text-gray-300">
                <li>Brand: {product.category}</li>
                <li>Dimensions: 10x10x5 cm</li>
                <li>Weight: 500g</li>
                <li>Material: Eco-friendly plastic</li>
                <li>Care Instructions: Hand wash only</li>
              </ul>
            </div>

            {/* Purchase Options */}
            <div className="flex items-center gap-4 mt-6">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="border rounded-lg w-16 text-center py-2 focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Quantity"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-300">
                Add to Cart
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-md transition duration-300">
                Buy Now
              </button>
            </div>

            {/* Secure Payments */}
            <div className="flex items-center gap-2 mt-4">
              <BsShieldCheck className="text-blue-600 text-lg" />
              <p className="text-gray-600 dark:text-gray-300">
                Secure Payment and Easy Returns
              </p>
            </div>

            {/* Social Sharing */}
            <div className="flex gap-4 mt-6">
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 transition duration-300"
                aria-label="Share on Facebook"
              >
                <FaFacebook /> Facebook
              </button>
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 transition duration-300"
                aria-label="Share on Twitter"
              >
                <FaTwitter /> Twitter
              </button>
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 flex items-center gap-2 transition duration-300"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp /> WhatsApp
              </button>
            </div>
          </section>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Customer Reviews
          </h2>
          <div className="mt-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-[#333333] p-4 rounded-lg shadow-md mb-4"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  John Doe
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  &quot;This product is amazing! Highly recommended.&quot;
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductOverview;