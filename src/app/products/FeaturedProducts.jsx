'use client';

import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image"; // Import Next.js Image component

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products?limit=8");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-300 rounded-lg h-12 w-48"></div>
          <div className="bg-gray-300 rounded-lg h-4 w-64"></div>
          <div className="bg-gray-300 rounded-lg h-4 w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div className="text-red-500 text-lg font-semibold">
          {error} -{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-[#212121]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12 dark:text-white">
          Featured Products
        </h2>

        {/* Carousel */}
        <Carousel
          responsive={{
            superLargeDesktop: {
              breakpoint: { max: 4000, min: 3000 },
              items: 5,
            },
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 4,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 2,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
            },
          }}
          infinite
          autoPlay
          autoPlaySpeed={3000}
          keyBoardControl
          customTransition="transform 0.5s ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mx-4 flex flex-col justify-between w-[280px] h-[500px] md:w-[300px] lg:w-[320px] overflow-hidden dark:bg-gray-800 dark:text-white">
      <div className="relative flex flex-col justify-between flex-grow">
        {/* Replace <img> with <Image> */}
        <Image
          src={product.image}
          alt={product.title}
          width={400} // Set a specific width for the image
          height={300} // Set a specific height for the image
          className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 transform hover:scale-110"
          priority // Optional: Use if you want to preload the image for better performance
        />
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
          ${product.price}
        </span>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 dark:text-white">{product.title}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">{product.description}</p>

        <div className="flex items-center mb-4">
          <span className="text-yellow-400 mr-1">★★★★☆</span>
          <span className="text-sm text-gray-500 dark:text-gray-300">({product.rating.count} reviews)</span>
        </div>
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        aria-label={`View product: ${product.title}`}
      >
        View Product
      </button>
    </div>
  );
};

export default FeaturedProducts;
