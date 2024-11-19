"use client"
import { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/api";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const userId = "default-user";
      const appSlug = "artisan-marketplace";
      setIsLoading(true);
      const data = await fetchProducts(userId, appSlug);
      setProducts(data);
      setIsLoading(false);
    }

    loadProducts();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">Products</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-md">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <h2 className="font-bold text-lg">{product.name}</h2>
              <p className="text-gray-500">{product.description}</p>
              <p className="font-bold text-blue-600">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
