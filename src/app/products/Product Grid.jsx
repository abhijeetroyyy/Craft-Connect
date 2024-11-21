"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";

const SearchBar = ({ searchQuery, handleSearchChange, toggleFilterPopup }) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center flex-grow border-b-2 border-gray-300 dark:border-gray-700 pb-2">
      <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none text-lg"
        aria-label="Search products"
      />
    </div>
    <button
      onClick={toggleFilterPopup}
      className="ml-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-300"
    >
      <FiMenu className="text-2xl" />
    </button>
  </div>
);

const FilterPopup = ({ filters, handleFilterChange, handleClearFilters, categories, isOpen, togglePopup }) => (
  <div
    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="bg-white dark:bg-[#212121] w-11/12 max-w-md p-6 rounded-lg shadow-lg relative">
      <button
        onClick={togglePopup}
        className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 text-2xl"
        aria-label="Close filter"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          className="w-full p-2 bg-gray-100 dark:bg-[#212121] rounded-lg focus:outline-none text-lg"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Price Range</label>
        <div className="flex justify-between">
          <input
            type="number"
            min="0"
            max="1000"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handleFilterChange("priceRange", [parseInt(e.target.value), filters.priceRange[1]])
            }
            className="w-1/2 p-2 bg-gray-100 dark:bg-[#212121] rounded-lg focus:outline-none text-lg"
          />
          <span className="mx-2">to</span>
          <input
            type="number"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange("priceRange", [filters.priceRange[0], parseInt(e.target.value)])
            }
            className="w-1/2 p-2 bg-gray-100 dark:bg-[#212121] rounded-lg focus:outline-none text-lg"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sort By</label>
        <select
          className="w-full p-2 bg-gray-100 dark:bg-[#212121] rounded-lg focus:outline-none text-lg"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          aria-label="Sort products"
        >
          <option value="">None</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="ratingHighToLow">Rating: High to Low</option>
        </select>
      </div>

      {/* New Products Toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Filter</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isNew}
              onChange={(e) => handleFilterChange("isNew", e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2 text-sm">New Products</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasDiscount}
              onChange={(e) => handleFilterChange("hasDiscount", e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2 text-sm">Discounted Items</span>
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-lg"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

const ProductCard = ({ product, addToWishlist, addToCart, buyNow }) => (
  <div className="bg-white dark:bg-[#212121] shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
    <img
      src={product.image}
      alt={product.name}
      className="h-56 w-full object-contain bg-transparent p-4"
    />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex-grow">
        {product.description.slice(0, 60)}...
      </p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-blue-500 font-semibold text-lg">${product.price.toFixed(2)}</p>
        <p className="text-yellow-500 font-semibold">{product.rating?.rate}⭐</p>
      </div>
    </div>
    <div className="flex justify-between p-4 gap-2">
      <button
        onClick={() => addToWishlist(product.id)}
        className="p-2 flex justify-center items-center text-center flex-grow rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 text-blue-500 hover:text-white transition"
      >
        <AiOutlineHeart />
      </button>
      <button
        onClick={() => buyNow(product.id)}
        className="p-2 flex justify-center items-center flex-grow rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
      >
        Buy Now
      </button>
      <button
        onClick={() => addToCart(product.id)}
        className="p-2 flex justify-center items-center flex-grow rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 text-blue-500 hover:text-white transition"
      >
        <AiOutlineShoppingCart />
      </button>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-center items-center mt-6 gap-4">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
      aria-label="Previous page"
    >
      <FiChevronLeft />
    </button>
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 rounded-lg ${
          currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
      aria-label="Next page"
    >
      <FiChevronRight />
    </button>
  </div>
);

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    searchQuery: "",
    sortBy: "",
    isNew: false,
    hasDiscount: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
        setIsLoading(false);
      } catch {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesSearch = product.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesNew = !filters.isNew || product.isNew;
      const matchesDiscount = !filters.hasDiscount || product.discount > 0;

      return (
        matchesCategory &&
        matchesPrice &&
        matchesSearch &&
        matchesNew &&
        matchesDiscount
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "priceLowToHigh") return a.price - b.price;
      if (filters.sortBy === "priceHighToLow") return b.price - a.price;
      if (filters.sortBy === "ratingHighToLow") return b.rating.rate - a.rating.rate;
      return 0;
    });
  }, [products, filters]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const buyNow = (productId) => {
    alert(`Product ${productId} purchased!`);
  };

  return (
    <div className="bg-white dark:bg-[#212121] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <SearchBar
          searchQuery={filters.searchQuery}
          handleSearchChange={(value) => setFilters({ ...filters, searchQuery: value })}
          toggleFilterPopup={() => setIsFilterPopupOpen((prev) => !prev)}
        />
        <div className="lg:flex lg:gap-8">
          <FilterPopup
            filters={filters}
            handleFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
            handleClearFilters={() => setFilters({ category: "", priceRange: [0, 1000], searchQuery: "", sortBy: "", isNew: false, hasDiscount: false })}
            categories={[...new Set(products.map((p) => p.category))]}
            isOpen={isFilterPopupOpen}
            togglePopup={() => setIsFilterPopupOpen((prev) => !prev)}
          />
          <div className="lg:w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, index) => <Skeleton key={index} height={320} />)
            ) : error ? (
              <p className="text-red-500 col-span-full">Failed to load products.</p>
            ) : paginatedProducts.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300 col-span-full">No products found.</p>
            ) : (
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToWishlist={(id) => setWishlist((prev) => [...prev, id])}
                  addToCart={(id) => setCart((prev) => [...prev, id])}
                  buyNow={buyNow}
                />
              ))
            )}
          </div>
        </div>
        {!isLoading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ProductGrid;