import React from "react";

const ProductOverview = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Product Name */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Product Name
        </h1>

        {/* Product Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="border rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/500"
                alt="Product"
                className="w-full"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <img
                src="https://via.placeholder.com/100"
                alt="Thumbnail"
                className="w-20 h-20 border rounded cursor-pointer"
              />
              <img
                src="https://via.placeholder.com/100"
                alt="Thumbnail"
                className="w-20 h-20 border rounded cursor-pointer"
              />
              <img
                src="https://via.placeholder.com/100"
                alt="Thumbnail"
                className="w-20 h-20 border rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-3xl font-semibold text-gray-800">
                ₹999.00
              </span>
              <span className="text-gray-500 line-through ml-4">₹1,499.00</span>
              <span className="text-green-600 font-semibold ml-2">
                (33% OFF)
              </span>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <span className="text-green-600 font-medium">In Stock</span>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-4">
              A brief description of the product highlighting its key features
              and benefits.
            </p>

            {/* Purchase Options */}
            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="border rounded w-16 text-center py-2"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Add to Cart
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Buy Now
              </button>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Specifications:
              </h2>
              <ul className="list-disc ml-6 text-gray-600">
                <li>Dimensions: 10x10x5 cm</li>
                <li>Weight: 500g</li>
                <li>Material: Eco-friendly plastic</li>
                <li>Care Instructions: Hand wash only</li>
              </ul>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <span className="text-gray-600">
                Category: <span className="text-gray-800 font-medium">Gadgets</span>
              </span>
            </div>

            {/* Social Sharing */}
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-gray-800">
                Share on Facebook
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                Share on Twitter
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/200"
                alt="Related Product"
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-800">Product 1</h3>
                <span className="text-gray-600">₹599.00</span>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <img
                src="https://via.placeholder.com/200"
                alt="Related Product"
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-800">Product 2</h3>
                <span className="text-gray-600">₹799.00</span>
              </div>
            </div>
            {/* Add more related products here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;


