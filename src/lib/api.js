export async function fetchProducts(userId, appSlug) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated product data
        const fakeProducts = [
          {
            id: 1,
            name: "Handcrafted Wooden Bowl",
            price: 25.0,
            description: "A beautifully handcrafted wooden bowl made by skilled artisans.",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            name: "Artisan Ceramic Vase",
            price: 40.0,
            description: "A unique ceramic vase with a stunning glaze.",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 3,
            name: "Woven Basket Set",
            price: 30.0,
            description: "A set of eco-friendly woven baskets for storage and decor.",
            image: "https://via.placeholder.com/150",
          },
        ];
  
        console.log(`Fetched products for userId: ${userId}, appSlug: ${appSlug}`);
        resolve(fakeProducts);
      }, 1000); // Simulates a 1-second API response delay
    });
  }
  