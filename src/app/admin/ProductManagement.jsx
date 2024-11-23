import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL } from '@/components/firebase-config';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    tags: '',
    shippingDetails: '',
    images: [],
    approvalStatus: 'pending',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);

        // Fetch categories (use dummy categories if none exist)
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (categoriesList.length === 0) {
          // Add dummy categories if the categories collection is empty
          const dummyCategories = ['Bio Fertilizers', 'Handmade Crafts', 'Organic Fertilizers', 'Woodwork', 'Pottery'];
          dummyCategories.forEach(async (category) => {
            const categoryRef = doc(collection(db, 'categories'));
            await setDoc(categoryRef, { name: category });
          });
          setCategories(dummyCategories);
        } else {
          setCategories(categoriesList);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const imageUrls = [];

    for (let file of files) {
      const storageRef = ref(storage, `product_images/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }

    setFormData({
      ...formData,
      images: imageUrls,
    });
  };

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        // Update existing product
        const productRef = doc(db, 'products', selectedProduct.id);
        await updateDoc(productRef, formData);
        alert('Product updated successfully!');
      } else {
        // Add new product
        const newProductRef = doc(collection(db, 'products'));
        await setDoc(newProductRef, formData);
        alert('Product added successfully!');
      }

      // Clear form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        tags: '',
        shippingDetails: '',
        images: [],
        approvalStatus: 'pending',
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Handle product approval/rejection
  const handleApproval = async (productId, status) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { approvalStatus: status });
      alert(`Product ${status}`);
    } catch (error) {
      console.error('Error updating product approval status:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      alert('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-5">Product Management</h2>

      <div>
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Stock Quantity</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Approval Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="border p-3">{product.name}</td>
                <td className="border p-3">${product.price}</td>
                <td className="border p-3">{product.category}</td>
                <td className="border p-3">{product.stockQuantity}</td>
                <td className="border p-3">{product.status}</td>
                <td className="border p-3">{product.approvalStatus}</td>
                <td className="border p-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">{selectedProduct ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="p-2 border rounded w-full"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            className="p-2 border rounded w-full"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="p-2 border rounded w-full"
          >
            {categories.map((category, index) => (
              <option key={index} value={category.name || category}>
                {category.name || category}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageUpload}
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Product Tags"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="shippingDetails"
            value={formData.shippingDetails}
            onChange={handleInputChange}
            placeholder="Shipping Details"
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
            {selectedProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
